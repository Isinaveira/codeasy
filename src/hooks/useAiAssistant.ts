import { useEffect, useState, useRef, type FormEvent } from "react";
import { useCodeStore, type DevMode } from "../store/useCodeStore";

export type AssistantStatus = "checking" | "config_error" | "ready" | "downloadable" | "downloading";

export interface Message {
  role: "user" | "assistant";
  text: string;
}

// Interfaces de tipos experimentales para Chrome Built-in AI
interface LanguageModelCapabilities {
  available: "readily" | "after-download" | "no";
}

interface LanguageModelAvailabilityOptions {
  languages: string[];
}

interface LanguageModelSession {
  prompt: (prompt: string) => Promise<string>;
  destroy?: () => void;
}

interface LanguageModelFactory {
  availability?: (options?: LanguageModelAvailabilityOptions) => Promise<"available" | "downloadable" | "downloading" | "unavailable" | "downloaded">;
  capabilities?: () => Promise<LanguageModelCapabilities>;
  create: (options?: { systemPrompt?: string }) => Promise<LanguageModelSession>;
}

export function useAiAssistant() {
  // 1. Contexto de Zustand
  const { isAiOpen, html, css, js, devMode } = useCodeStore();

  // 2. Estados locales
  const [status, setStatus] = useState<AssistantStatus>("checking");
  const [aiSession, setAiSession] = useState<LanguageModelSession | null>(null);
  
  const [messagesByMode, setMessagesByMode] = useState<Record<DevMode, Message[]>>({
    web: [
      {
        role: "assistant",
        text: "¡Hola! He detectado tu entorno local con éxito. Estoy conectado a tus editores de desarrollo web en Codeasy. ¿En qué puedo ayudarte hoy con tu HTML, CSS o JavaScript?"
      }
    ],
    algorithms: [
      {
        role: "assistant",
        text: "¡Hola! He detectado tu entorno local con éxito. Estoy conectado a tu editor de algoritmos en JavaScript. ¿En qué puedo ayudarte hoy con tus problemas o desafíos de código?"
      }
    ]
  });

  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 3. Referencias seguras
  const detectedApiRef = useRef<LanguageModelFactory | null>(null);
  const aiSessionRef = useRef<LanguageModelSession | null>(null);

  // 4. Prompts dinámicos según el modo
  const systemPrompt = devMode === "web"
    ? "Eres un asistente de IA experto en desarrollo web metido en el editor Codeasy. Revisa el código y ayuda de forma concisa en español. El contexto que se te pasará incluye HTML, CSS y JavaScript."
    : "Eres un asistente de IA experto en algoritmos y JavaScript metido en el editor Codeasy. Revisa el código y ayuda de forma concisa en español. El contexto que se te pasará incluye únicamente JavaScript.";

  // 5. Verificación adaptativa del entorno de IA al abrir el panel o cambiar de modo
  useEffect(() => {
    if (!isAiOpen) return;

    const checkAiAvailability = async () => {
      try {
        setStatus("checking");

        let apiTarget: LanguageModelFactory | null = null;
        const win = window as any;

        // Rastreamos las tres variantes conocidas de la API de Google (2025/2026)
        if (typeof win.LanguageModel !== "undefined") {
          apiTarget = win.LanguageModel;
        } else if ("ai" in win && "assistant" in win.ai) {
          apiTarget = win.ai.assistant;
        } else if ("ai" in win && "languageModel" in win.ai) {
          apiTarget = win.ai.languageModel;
        }

        if (!apiTarget) {
          setStatus("config_error");
          return;
        }

        // Guardamos la API compatible en la referencia segura
        detectedApiRef.current = apiTarget;

        let state: string = "unavailable";

        // Ejecutamos la comprobación según los métodos disponibles en la versión de Chrome
        if (typeof apiTarget.availability === "function") {
          state = await apiTarget.availability({ languages: ["es"] });
        } else if (typeof apiTarget.capabilities === "function") {
          const caps = await apiTarget.capabilities();
          const capState = caps.available;
          if (capState === "readily") state = "available";
          if (capState === "no") state = "unavailable";
        }

        console.log("🤖 Codeasy AI Engine - Estado detectado:", state);

        // Derivación de estados
        if (state === "available" || state === "downloaded") {
          // Destruimos la sesión previa si existe
          if (aiSessionRef.current && typeof aiSessionRef.current.destroy === "function") {
            try {
              aiSessionRef.current.destroy();
            } catch (e) {
              console.warn("Error destruyendo la sesión de IA previa:", e);
            }
          }

          const session = await apiTarget.create({ systemPrompt });
          aiSessionRef.current = session;
          setAiSession(session);
          setStatus("ready");
        } else if (state === "downloadable") {
          setStatus("downloadable");
        } else if (state === "downloading") {
          setStatus("downloading");
        } else {
          setStatus("config_error");
        }
      } catch (error) {
        console.error("Error validando IA:", error);
        setStatus("config_error");
      }
    };

    checkAiAvailability();

    // Cleanup session on unmount/close/mode-change if applicable
    return () => {
      if (aiSessionRef.current && typeof aiSessionRef.current.destroy === "function") {
        try {
          aiSessionRef.current.destroy();
          aiSessionRef.current = null;
        } catch (e) {
          console.warn("Error destruyendo la sesión de IA:", e);
        }
      }
    };
  }, [isAiOpen, devMode]);

  // 6. Manejador de descarga asíncrona nativa
  const handleDownload = async () => {
    const apiTarget = detectedApiRef.current;
    if (!apiTarget) return;

    setStatus("downloading");
    try {
      if (aiSessionRef.current && typeof aiSessionRef.current.destroy === "function") {
        try {
          aiSessionRef.current.destroy();
        } catch (e) {
          console.warn("Error destruyendo la sesión de IA previa:", e);
        }
      }

      const session = await apiTarget.create({ systemPrompt });
      aiSessionRef.current = session;
      setAiSession(session);
      setStatus("ready");
    } catch (error) {
      console.error("Error en la descarga del modelo:", error);
      setStatus("config_error");
    }
  };

  // 7. Enviar mensaje e inyectar contexto de los editores
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !aiSession || isGenerating) return;

    const userText = inputValue;
    const activeMode = devMode;
    setInputValue("");
    setIsGenerating(true);

    // Renderizamos el mensaje del desarrollador
    setMessagesByMode((prev) => ({
      ...prev,
      [activeMode]: [...prev[activeMode], { role: "user", text: userText }]
    }));

    // Inyección de contexto invisible enriquecida
    const promptConContexto = activeMode === "web"
      ? `
[CONTEXTO DEL CÓDIGO ACTUAL EN EL EDITOR DE CODEASY (MODO DESARROLLO WEB)]
---
HTML:
${html}
---
CSS:
${css}
---
JAVASCRIPT:
${js}
---
[FIN DEL CONTEXTO]

Pregunta del usuario: ${userText}
`
      : `
[CONTEXTO DEL CÓDIGO ACTUAL EN EL EDITOR DE CODEASY (MODO ALGORITMOS)]
---
JAVASCRIPT:
${js}
---
[FIN DEL CONTEXTO]

Pregunta del usuario: ${userText}
`;

    try {
      const response = await aiSession.prompt(promptConContexto);
      setMessagesByMode((prev) => ({
        ...prev,
        [activeMode]: [...prev[activeMode], { role: "assistant", text: response }]
      }));
    } catch (error) {
      console.error("Error generando respuesta local:", error);
      setMessagesByMode((prev) => ({
        ...prev,
        [activeMode]: [
          ...prev[activeMode],
          { role: "assistant", text: "Lo siento, ha ocurrido un error al procesar el código localmente en Gemini Nano." }
        ]
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  const messages = messagesByMode[devMode] || [];

  return {
    status,
    messages,
    inputValue,
    setInputValue,
    isGenerating,
    isAiOpen,
    handleDownload,
    handleSendMessage
  };
}
