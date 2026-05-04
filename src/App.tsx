import { useCodeStore } from "./store/useCodeStore";
import EditorPane from "./components/EditorPane";
import PreviewPane from "./components/PreviewPane";
import { useEffect } from "react";
function App() {
  const {html, css, js, setHtml, setCss, setJs, addLog } = useCodeStore();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if(event.data.type === 'CONSOLE_LOG') {
        addLog(event.data.content);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => window.removeEventListener('message', handleMessage);
  }, [addLog])

  return (
    <main className="grid grid-cols-2 grid-rows-2 h-screen w-full bg-[#1e1e1e] text-white">
      <EditorPane 
        title="HTML" 
        value={html} 
        colorClass="text-orange-400" 
        onChange={setHtml} 
      />

      <EditorPane 
        title="CSS" 
        value={css} 
        colorClass="text-blue-400" 
        onChange={setCss} 
      />

      <EditorPane 
        title="JS" 
        value={js} 
        colorClass="text-yellow-400" 
        onChange={setJs} 
      />

      <PreviewPane 
        title="Preview"
      />
    </main>
  )
}

export default App;
