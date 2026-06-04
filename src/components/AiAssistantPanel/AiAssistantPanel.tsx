import { useState, useCallback } from "react";
import { useAiAssistant } from "../../hooks/useAiAssistant";
import { useCodeStore } from "../../store/useCodeStore";
import { useToast } from "../../hooks/useToast";
import { BrainCircuit, History } from "lucide-react";
import {
  CheckingScreen,
  DownloadableScreen,
  DownloadingScreen,
  ConfigErrorScreen
} from "./StatusScreens";
import ChatInterface from "./ChatInterface";
import ConversationSidebar from "./ConversationSidebar";
import ImportDiffModal from "./ImportDiffModal";

interface ImportTarget {
  code: string;
  language: string;
}

export default function AiAssistantPanel() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [importTarget, setImportTarget] = useState<ImportTarget | null>(null);

  const { toast, showToast, dismissToast } = useToast();
  const devMode = useCodeStore((s) => s.devMode);
  const currentCode = useCodeStore((s) => {
    if (!importTarget) return "";
    const lang = importTarget.language === "javascript" ? "js" : importTarget.language;
    if (devMode === "algorithms" && lang === "js") return s.algoJs;
    if (lang === "html") return s.html;
    if (lang === "css") return s.css;
    if (lang === "js") return s.webJs;
    return "";
  });
  const setHtml = useCodeStore((s) => s.setHtml);
  const setCss = useCodeStore((s) => s.setCss);
  const setJs = useCodeStore((s) => s.setJs);

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

  const handleImportCode = useCallback((code: string, language: string) => {
    setImportTarget({ code, language });
  }, []);

  const handleAcceptImport = useCallback(() => {
    if (!importTarget) return;
    const lang = importTarget.language === "javascript" ? "js" : importTarget.language;
    if (lang === "html") setHtml(importTarget.code);
    else if (lang === "css") setCss(importTarget.code);
    else if (lang === "js") setJs(importTarget.code);
    setImportTarget(null);
    showToast("Código importado correctamente");
  }, [importTarget, setHtml, setCss, setJs, showToast]);

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
          className="absolute top-2.5 left-2.5 z-20 w-9 h-9 flex items-center justify-center bg-canvas hover:bg-surface border border-line rounded-md shadow-sm text-text/70 hover:text-brand transition-colors"
          title={isSidebarOpen ? "Ocultar historial" : "Mostrar historial"}
        >
          <History className="w-4 h-4" />
        </button>

        {isSidebarOpen && <ConversationSidebar />}
        
        <div className={`flex-1 flex flex-col relative overflow-hidden transition-all duration-300 ${!isSidebarOpen ? "ml-14" : ""}`}>
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
              onImportCode={handleImportCode}
            />
          )}
        </div>
      </div>

      {importTarget && (
        <ImportDiffModal
          currentCode={currentCode}
          suggestedCode={importTarget.code}
          language={importTarget.language}
          onAccept={handleAcceptImport}
          onClose={() => setImportTarget(null)}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1e1e2e] text-[#cdd6f4] px-5 py-3 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span>{toast}</span>
          <button
            onClick={dismissToast}
            className="ml-2 text-dim hover:text-main cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  );
}
