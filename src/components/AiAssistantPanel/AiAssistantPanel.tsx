import { useState } from "react";
import { useAiAssistant } from "../../hooks/useAiAssistant";
import { BrainCircuit, History } from "lucide-react";
import {
  CheckingScreen,
  DownloadableScreen,
  DownloadingScreen,
  ConfigErrorScreen
} from "./StatusScreens";
import ChatInterface from "./ChatInterface";
import ConversationSidebar from "./ConversationSidebar";

export default function AiAssistantPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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

  if (!isAiOpen) return null;

  return (
    <section
      data-testid="ai-panel"
      className="w-[45%] h-full bg-surface border-l border-line flex flex-col transition-all duration-300"
    >
      <header className="flex flex-row items-center p-3 bg-canvas text-xs font-bold uppercase tracking-widest text-main border-b border-line gap-2 select-none">
        <BrainCircuit className="w-4 h-4 text-brand" /> 
        <span>AI Assistant</span>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-2 left-2 z-20 p-2 bg-canvas hover:bg-surface border border-line rounded-md shadow-sm text-text/70 hover:text-brand transition-colors"
          title={isSidebarOpen ? "Ocultar historial" : "Mostrar historial"}
        >
          <History className="w-4 h-4" />
        </button>

        {isSidebarOpen && <ConversationSidebar />}
        
        <div className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300 ${!isSidebarOpen ? "ml-12" : ""}`}>
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
        </div>
      </div>
    </section>
  );
}
