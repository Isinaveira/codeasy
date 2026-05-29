import { useCodeStore } from "./store/useCodeStore";
import EditorPane from "./components/EditorPane/EditorPane";
import PreviewPane from "./components/PreviewPane/PreviewPane";
import AiAssistantPanel from "./components/AiAssistantPanel/AiAssistantPanel";
import TopBar from "./components/TopBar/TopBar";
import { useEffect } from "react";
import { FileCode, FileText, Blocks } from "lucide-react";

function App() {
  const { 
    html, css, js, 
    setHtml, setCss, setJs, 
    addLog, theme,
    layoutMode, activeTab, setActiveTab,
    isHtmlCollapsed, isCssCollapsed, isJsCollapsed,
    toggleHtmlCollapsed, toggleCssCollapsed, toggleJsCollapsed,
    editorWidthPercent, setEditorWidthPercent
  } = useCodeStore();

  // Sincroniza el tema con el elemento HTML raíz
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Intercepta los logs enviados desde el iframe de vista previa
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CONSOLE_LOG') {
        const { logType, content, timestamp } = event.data;
        addLog({
          type: logType || 'log',
          content: content || '',
          timestamp: timestamp || new Date().toLocaleTimeString()
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addLog]);

  // Manejador del arrastre horizontal
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = editorWidthPercent;
    const containerWidth = window.innerWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;
      const newWidth = startWidth + deltaPercent;

      // Límites de seguridad: 15% - 80%
      if (newWidth >= 15 && newWidth <= 80) {
        setEditorWidthPercent(newWidth);
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-canvas text-main overflow-hidden transition-colors duration-200">
      <TopBar />
      
      <div className="flex flex-1 w-full overflow-hidden relative">
        <main className="flex flex-row flex-1 h-full overflow-hidden relative bg-canvas p-2 gap-0 select-none">
          
          {/* PANEL IZQUIERDO: EDITORES */}
          <div 
            className="flex flex-col h-full overflow-hidden pr-1.5 shrink-0" 
            style={{ width: `${editorWidthPercent}%` }}
          >
            {/* RENDER SEGÚN MODO DE LAYOUT */}
            {layoutMode === 'tabs' && (
              <div className="flex flex-col h-full overflow-hidden gap-2">
                {/* Selector de Pestañas Moderno */}
                <div className="flex items-center gap-1.5 p-1 bg-surface border border-line/45 rounded-lg shrink-0 shadow-2xs">
                  <button 
                    onClick={() => setActiveTab('html')}
                    className={`flex-1 py-1.5 px-3 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none
                      ${activeTab === 'html' 
                        ? 'bg-canvas text-orange-500 border border-line/30 shadow-2xs' 
                        : 'text-dim hover:text-main'
                      }`}
                  >
                    <FileCode className="w-3.5 h-3.5 text-orange-500" />
                    <span>HTML</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('css')}
                    className={`flex-1 py-1.5 px-3 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none
                      ${activeTab === 'css' 
                        ? 'bg-canvas text-blue-500 border border-line/30 shadow-2xs' 
                        : 'text-dim hover:text-main'
                      }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>CSS</span>
                  </button>

                  <button 
                    onClick={() => setActiveTab('js')}
                    className={`flex-1 py-1.5 px-3 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 select-none
                      ${activeTab === 'js' 
                        ? 'bg-canvas text-amber-500 border border-line/30 shadow-2xs' 
                        : 'text-dim hover:text-main'
                      }`}
                  >
                    <Blocks className="w-3.5 h-3.5 text-amber-500" />
                    <span>JavaScript</span>
                  </button>
                </div>

                {/* Editor Activo */}
                <div className="flex-1 min-h-0 flex flex-col relative">
                  {activeTab === 'html' && (
                    <EditorPane 
                      title="HTML" 
                      value={html} 
                      colorClass="text-orange-500 dark:text-orange-400" 
                      onChange={setHtml}
                      language="html"
                      theme={theme}
                    />
                  )}
                  {activeTab === 'css' && (
                    <EditorPane 
                      title="CSS" 
                      value={css} 
                      colorClass="text-blue-500 dark:text-blue-400" 
                      onChange={setCss}
                      language="css"
                      theme={theme}
                    />
                  )}
                  {activeTab === 'js' && (
                    <EditorPane 
                      title="JavaScript" 
                      value={js} 
                      colorClass="text-amber-500 dark:text-amber-400" 
                      onChange={setJs}
                      language="javascript"
                      theme={theme}
                    />
                  )}
                </div>
              </div>
            )}

            {layoutMode === 'sidebar' && (
              <div className="flex flex-col h-full overflow-hidden gap-2">
                <EditorPane 
                  title="HTML" 
                  value={html} 
                  colorClass="text-orange-500 dark:text-orange-400" 
                  onChange={setHtml}
                  language="html"
                  theme={theme}
                  isCollapsible={true}
                  isCollapsed={isHtmlCollapsed}
                  onToggleCollapse={toggleHtmlCollapsed}
                />
                <EditorPane 
                  title="CSS" 
                  value={css} 
                  colorClass="text-blue-500 dark:text-blue-400" 
                  onChange={setCss}
                  language="css"
                  theme={theme}
                  isCollapsible={true}
                  isCollapsed={isCssCollapsed}
                  onToggleCollapse={toggleCssCollapsed}
                />
                <EditorPane 
                  title="JavaScript" 
                  value={js} 
                  colorClass="text-amber-500 dark:text-amber-400" 
                  onChange={setJs}
                  language="javascript"
                  theme={theme}
                  isCollapsible={true}
                  isCollapsed={isJsCollapsed}
                  onToggleCollapse={toggleJsCollapsed}
                />
              </div>
            )}

            {layoutMode === 'grid' && (
              <div className="flex flex-col h-full overflow-hidden gap-2">
                <div className="flex-1 min-h-0 flex flex-col relative">
                  <EditorPane 
                    title="HTML" 
                    value={html} 
                    colorClass="text-orange-500 dark:text-orange-400" 
                    onChange={setHtml}
                    language="html"
                    theme={theme}
                  />
                </div>
                <div className="flex-1 min-h-0 flex flex-col relative">
                  <EditorPane 
                    title="CSS" 
                    value={css} 
                    colorClass="text-blue-500 dark:text-blue-400" 
                    onChange={setCss}
                    language="css"
                    theme={theme}
                  />
                </div>
              </div>
            )}
          </div>

          {/* DIVISOR DE ARRASTRE VERTICAL */}
          <div 
            onMouseDown={handleMouseDown}
            className="w-1.5 hover:w-2 shrink-0 cursor-col-resize h-full bg-canvas hover:bg-brand/40 active:bg-brand/60 transition-all duration-200 z-10 flex items-center justify-center relative group"
          >
            <div className="absolute top-1/2 -translate-y-1/2 w-0.5 h-10 rounded bg-line opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* PANEL DERECHO: PREVIEW (+ JS SI ES MODO GRID) */}
          <div className="flex-1 h-full pl-1.5 flex flex-col overflow-hidden gap-2">
            {layoutMode === 'grid' ? (
              <div className="flex flex-col h-full overflow-hidden gap-2">
                <div className="h-[40%] min-h-[80px] flex flex-col relative">
                  <EditorPane 
                    title="JavaScript" 
                    value={js} 
                    colorClass="text-amber-500 dark:text-amber-400" 
                    onChange={setJs}
                    language="javascript"
                    theme={theme}
                  />
                </div>
                <div className="flex-1 min-h-0 flex flex-col relative">
                  <PreviewPane title="Preview" />
                </div>
              </div>
            ) : (
              <div className="flex-1 h-full min-h-0 relative">
                <PreviewPane title="Preview" />
              </div>
            )}
          </div>

        </main>
        <AiAssistantPanel />
      </div>
    </div>
  );
}

export default App;