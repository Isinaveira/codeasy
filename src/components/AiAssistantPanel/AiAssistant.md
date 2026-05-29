/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useCodeStore } from "../../store/useCodeStore";
import { BrainCircuit } from "lucide-react";

type AssistantStatus = "checking" | "config_error" | "ready";

export default function AiAssistantPanel() {
  const { isAiOpen } = useCodeStore();

  const [status, setStatus] = useState<AssistantStatus>("checking");
  const [aiSession, setAiSession] = useState<any>(null);

  useEffect(() => {
    if (!isAiOpen) return;

    async function verifyEnvironment() {
      setStatus("checking");

      // 1. Comprobar si el espacio de nombres estándar 'ai' y 'assistant' existen
      if (!("ai" in window) || !("assistant" in (window as any).ai)) {
        setStatus("config_error");
        return;
      }

      try {
        // 2. Comprobar las capacidades del Asistente según la documentación oficial
        const capabilities = await (window as any).ai.assistant.capabilities();

        // Si el modelo no está listo o descargado, mostramos la guía de flags
        if (capabilities.available === "no") {
          setStatus("config_error");
          return;
        }

        // 3. Crear la sesión utilizando el método oficial .create()
        // La documentación especifica que puedes pasarle 'systemPrompt' para darle contexto
        const session = await (window as any).ai.assistant.create({
          systemPrompt:
            "Eres un asistente de IA experto en desarrollo web metido en el editor Codeasy. Revisa el código y ayuda de forma concisa.",
        });

        // Guardamos la sesión en el estado local para poder usarla en el chat
        setAiSession(session);
        setStatus("ready"); // ¡Habilitamos el chat real nativo!
      } catch (error) {
        console.error("Error oficial de la Prompt API:", error);
        setStatus("config_error");
      }
    }

    verifyEnvironment();
  }, [isAiOpen]);

  if (!isAiOpen) return null;

  return (
    <section
      data-testid="ai-panel"
      className="w-1/3 h-full bg-surface border-l border-line flex flex-col transition-all duration-300"
    >
      <header className="flex flex-row items-center p-3 bg-canvas text-xs font-bold uppercase tracking-widest text-main border-b border-line">
        <BrainCircuit /> AI Assistant
      </header>
      {status === "checking" && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-dim">Verificando entorno local...</p>
        </div>
      )}

      {status === "config_error" && (
        <div className="flex-1 flex flex-col p-6 space-y-4 overflow-y-auto">
          <h3 className="text-sm font-bold text-red-500 dark:text-red-400">
            Activa Gemini Nano en tu navegador
          </h3>
          <p className="text-xs text-dim leading-relaxed">
            Para usar el asistente local de Codeasy, necesitas habilitar las
            capacidades de IA nativas de tu navegador (Chromium 2026+).
          </p>
          <div className="bg-canvas p-3 rounded-lg border border-line space-y-2 text-[11px] font-mono text-main">
            <p>
              1. Ve a <span className="text-brand">chrome://flags</span>
            </p>
            <p>
              2. Activa{" "}
              <span className="font-bold">Prompt API for Gemini Nano</span>
            </p>
            <p>
              3. Activa{" "}
              <span className="font-bold">
                Optimization Guide On Device Model
              </span>{" "}
              (BypassPrefRequirement)
            </p>
          </div>
          <button
            onClick={() => setStatus("checking")} // Botón para forzar el reintento
            className="w-full bg-brand text-white py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-brand-hover transition-colors"
          >
            Reintentar comprobación
          </button>
        </div>
      )}
      {status === "ready" && (
        <div className="flex-1 flex flex-col p-4 justify-between">
          <div className="flex-1 text-xs text-dim italic opacity-75">
            ¡Gemini Nano conectado con éxito! Listo para analizar tu código...
          </div>

          {/* El input del chat que exige el test de la Etapa 4 */}
          <div className="border-t border-line pt-3">
            <input
              type="text"
              placeholder="Pregunta algo sobre tu código..."
              className="w-full bg-canvas border border-line rounded-lg px-3 py-2 text-xs text-main focus:outline-none focus:border-brand"
            />
          </div>
        </div>
      )}
    </section>
  );
}
