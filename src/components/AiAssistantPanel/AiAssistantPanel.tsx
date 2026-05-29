import { useAiAssistant } from "../../hooks/useAiAssistant";
import { BrainCircuit } from "lucide-react";
import {
  CheckingScreen,
  DownloadableScreen,
  DownloadingScreen,
  ConfigErrorScreen
} from "./StatusScreens";
import ChatInterface from "./ChatInterface";

export default function AiAssistantPanel() {
  const {
    status,
    messages,
    inputValue,
    setInputValue,
    isGenerating,
    isAiOpen,
    handleDownload,
    handleSendMessage
  } = useAiAssistant();

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

      {/* RENDERIZADO CONDICIONAL DE INTERFAZ SEGÚN EL ESTADO DE LA IA NATIVA */}
      {status === "checking" && <CheckingScreen />}

      {status === "downloadable" && (
        <DownloadableScreen onDownload={handleDownload} />
      )}

      {status === "downloading" && <DownloadingScreen />}

      {status === "config_error" && <ConfigErrorScreen />}

      {status === "ready" && (
        <ChatInterface
          messages={messages}
          inputValue={inputValue}
          onInputChange={setInputValue}
          onSubmit={handleSendMessage}
          isGenerating={isGenerating}
        />
      )}
    </section>
  );
}