/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useCodeStore } from "../../store/useCodeStore";
import { BrainCircuit } from "lucide-react";

// Tipado para el control de flujo de la IA nativa
type AssistantStatus = "checking" | "config_error" | "ready" | "downloadable" | "downloading";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export default function AiAssistantPanel() {
  // 1. Estados globales de Zustand (Contexto del editor)
  const { isAiOpen, html, css, js } = useCodeStore();

  // 2. Estados locales del componente
  const [status, setStatus] = useState<AssistantStatus>("checking");
  const [aiSession, setAiSession] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: "assistant", 
      text: "¡Hola! He detectado tu entorno local con éxito. Estoy conectado a tus editores de Codeasy. ¿En qué puedo ayudarte hoy?" 
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 3. Referencia para almacenar la API sin colisionar con los constructores de React
  const detectedApiRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 4. Verificación adaptativa del entorno de IA al abrir el panel
  useEffect(() => {
    if (!isAiOpen) return;

    const checkAiAvailability = async () => {
      try {
        setStatus("checking");

        let apiTarget: any = null;

        // Rastreamos las tres variantes conocidas de la API de Google (2025/2026)
        if (typeof (window as any).LanguageModel !== "undefined") {
          apiTarget = (window as any).LanguageModel;
        } else if ("ai" in window && "assistant" in (window as any).ai) {
          apiTarget = (window as any).ai.assistant;
        } else if ("ai" in window && "languageModel" in (window as any).ai) {
          apiTarget = (window as any).ai.languageModel;
        }

        if (!apiTarget) {
          setStatus("config_error");
          return;
        }

        // Guardamos la API compatible en la referencia segura
        detectedApiRef.current = apiTarget;

        let state = "unavailable";
        // Ejecutamos la comprobación según los métodos disponibles en la versión de Chrome
        if (typeof apiTarget.availability === "function") {
          state = await apiTarget.availability({ languages: ["es"] });
        } else if (typeof apiTarget.capabilities === "function") {
          const caps = await apiTarget.capabilities();
          state = caps.available;
          if (state === "readily") state = "available";
          if (state === "no") state = "unavailable";
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
  const handleSendMessage = async (e: React.FormEvent) => {
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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating]);

  // Si el panel global está cerrado en el store, no ocupamos espacio en el DOM
  if (!isAiOpen) return null;

  return (
    <section
      data-testid="ai-panel"
      className="w-1/3 h-full bg-surface border-l border-line flex flex-col transition-all duration-300"
    >
      {/* CABECERA DEL PANEL */}
      <header className="flex flex-row items-center p-3 bg-canvas text-xs font-bold uppercase tracking-widest text-main border-b border-line gap-2 select-none">
        <BrainCircuit className="w-4 h-4 text-brand" /> 
        <span>AI Assistant</span>
      </header>

      {/* RENDERIZADO CONDICIONAL DE INTERFAZ */}

      {/* FASE 1: COMPROBANDO ENTORNO */}
      {status === "checking" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-dim">Verificando entorno local...</p>
        </div>
      )}

      {/* FASE 2: COMPATIBLE PERO REQUIERE DESCARGAR */}
      {status === "downloadable" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
          <p className="text-xs text-main max-w-xs leading-relaxed">
            Tu ordenador cumple los requisitos. Necesitamos inicializar y descargar el modelo <span className="font-semibold text-brand">Gemini Nano</span> local (aprox. 2-3 GB) en tu navegador.
          </p>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-brand text-white hover:bg-brand-hover rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
          >
            Descargar e Iniciar Asistente
          </button>
        </div>
      )}

      {/* FASE 3: EN PROGRESO DE DESCARGA */}
      {status === "downloading" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-main font-semibold">Descargando Gemini Nano en segundo plano...</p>
          <p className="text-[11px] text-dim max-w-xs leading-relaxed">
            Chrome está bajando el modelo de forma nativa (va por unos 4 GB). Puedes ver el porcentaje exacto abriendo una pestaña en 
            <span className="font-mono text-brand block mt-1 select-all">chrome://on-device-internals</span>
          </p>
        </div>
      )}

      {/* FASE 4: ERROR DE CONFIGURACIÓN */}
      {status === "config_error" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <p className="text-xs font-bold text-red-500">Error de compatibilidad</p>
          <p className="text-[11px] text-dim max-w-xs leading-relaxed">
            No se ha detectado el motor local. Asegúrate de tener los flags de <span className="font-mono">chrome://flags</span> activos y suficiente espacio en disco (mínimo 22 GB libres).
          </p>
        </div>
      )}

      {/* FASE 5: CHAT DE PRODUCTO LISTO */}
      {status === "ready" && (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface">
          
          {/* Caja de scroll de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex flex-col max-w-[85%] rounded-lg p-3 text-xs leading-relaxed shadow-xs
                  ${msg.role === "user" 
                    ? "ml-auto bg-brand text-white" 
                    : "mr-auto bg-canvas border border-line text-main"
                  }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60
                  ${msg.role === "user" ? "text-white" : "text-brand"}`}
                >
                  {msg.role === "user" ? "Tú" : "Gemini Nano"}
                </span>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))}
            
            {/* Animación de respuesta */}
            {isGenerating && (
              <div className="mr-auto bg-canvas border border-line text-dim rounded-lg p-3 text-xs animate-pulse flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" />
                <span>Pensando...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Formulario de entrada de prompts */}
          <form 
            onSubmit={handleSendMessage}
            className="p-3 border-t border-line bg-canvas flex gap-2 items-center"
          >
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isGenerating}
              placeholder="Pregunta algo sobre tu código..."
              className="flex-1 bg-surface border border-line rounded-lg px-3 py-2 text-xs text-main focus:outline-none focus:border-brand disabled:opacity-50 transition-colors"
            />
            <button 
              type="submit"
              disabled={isGenerating || !inputValue.trim()}
              className="bg-brand text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </section>
  );
}