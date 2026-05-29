import { useEffect, useState, useRef, type FormEvent } from "react";
import { useCodeStore } from "../store/useCodeStore";

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
  const { isAiOpen, html, css, js } = useCodeStore();

  // 2. Estados locales
  const [status, setStatus] = useState<AssistantStatus>("checking");
  const [aiSession, setAiSession] = useState<LanguageModelSession | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "¡Hola! He detectado tu entorno local con éxito. Estoy conectado a tus editores de Codeasy. ¿En qué puedo ayudarte hoy?"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 3. Referencias seguras
  const detectedApiRef = useRef<LanguageModelFactory | null>(null);

  // 4. Verificación adaptativa del entorno de IA al abrir el panel
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
          const session = await apiTarget.create({
            systemPrompt: "Eres un asistente de IA experto en desarrollo web metido en el editor Codeasy. Revisa el código y ayuda de forma concisa en español."
          });
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

    // Cleanup session on unmount/close if applicable
    return () => {
      // Si la API soporta destrucción de sesión, la limpiamos
      if (aiSession && typeof aiSession.destroy === "function") {
        try {
          aiSession.destroy();
        } catch (e) {
          console.warn("Error destruyendo la sesión de IA:", e);
        }
      }
    };
  }, [isAiOpen]);

  // 5. Manejador de descarga asíncrona nativa
  const handleDownload = async () => {
    const apiTarget = detectedApiRef.current;
    if (!apiTarget) return;

    setStatus("downloading");
    try {
      const session = await apiTarget.create({
        systemPrompt: "Eres un asistente de IA experto en desarrollo web metido en el editor Codeasy. Revisa el código y ayuda de forma concisa en español."
      });
      setAiSession(session);
      setStatus("ready");
    } catch (error) {
      console.error("Error en la descarga del modelo:", error);
      setStatus("config_error");
    }
  };

  // 6. Enviar mensaje e inyectar contexto de los editores
  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !aiSession || isGenerating) return;

    const userText = inputValue;
    setInputValue("");
    setIsGenerating(true);

    // Renderizamos el mensaje del desarrollador
    setMessages((prev) => [...prev, { role: "user", text: userText }]);

    // Inyección de contexto invisible enriquecida
    const promptConContexto = `
[CONTEXTO DEL CÓDIGO ACTUAL EN EL EDITOR DE CODEASY]
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
`;

    try {
      const response = await aiSession.prompt(promptConContexto);
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    } catch (error) {
      console.error("Error generando respuesta local:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Lo siento, ha ocurrido un error al procesar el código localmente en Gemini Nano." }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

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
