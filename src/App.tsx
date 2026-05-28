import { useCodeStore } from "./store/useCodeStore";
import EditorPane from "./components/EditorPane";
import PreviewPane from "./components/PreviewPane";
import TopBar from "./components/TopBar";
import { useEffect } from "react";

function App() {
  const { html, css, js, setHtml, setCss, setJs, addLog, theme } = useCodeStore();

  // 💡 ESTA ES LA CLAVE: Sincroniza el tema con la raíz real de la web
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CONSOLE_LOG') {
        addLog(event.data.content);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addLog]);

  return (
    // Dejamos las clases semánticas limpias. Al estar la clase .dark en <html>, estos fondos mutarán sí o sí
    <div className="flex flex-col h-screen w-full bg-canvas text-main overflow-hidden transition-colors duration-200">
      <TopBar />
      
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Barra lateral unificada */}
        <aside className="w-16 h-full bg-surface border-r border-line flex flex-col items-center py-4 space-y-4 transition-colors duration-200">
          <div className="w-10 h-10 bg-canvas border border-line rounded flex items-center justify-center text-xs font-bold cursor-pointer hover:border-brand transition-colors">
            FS
          </div>
          <div className="w-10 h-10 bg-canvas border border-line rounded flex items-center justify-center text-xs font-bold cursor-pointer hover:border-brand transition-colors">
            ALG
          </div>
        </aside>    

        {/* El contenedor principal de la rejilla */}
        <main className="grid grid-cols-2 grid-rows-2 flex-1 h-full bg-line gap-[1px]">  
          <EditorPane 
            title="HTML" 
            value={html} 
            colorClass="text-orange-500 dark:text-orange-400" 
            onChange={setHtml}
            language="html"
            theme={theme}
          />

          <EditorPane 
            title="CSS" 
            value={css} 
            colorClass="text-blue-500 dark:text-blue-400" 
            onChange={setCss}
            language="css"
            theme={theme} 
          />

          <EditorPane 
            title="JS" 
            value={js} 
            colorClass="text-yellow-600 dark:text-yellow-400" 
            onChange={setJs}
            language="javascript"
            theme={theme} 
          />

          <PreviewPane 
            title="Preview"
          />
        </main>
      </div>
    </div>
  );
}

export default App;