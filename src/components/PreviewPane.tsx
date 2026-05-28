import { useCodeStore } from "../store/useCodeStore";

interface IPreviewPaneProps {
  title: string;
}

function PreviewPane({ title }: IPreviewPaneProps) {
  const { html, css, js, logs } = useCodeStore();

  const interceptorScript = `
    <script>
        const oldLog = console.log;
        console.log = function(...args) {
            oldLog.apply(console, args);
            window.parent.postMessage({
                type: 'CONSOLE_LOG',
                content: args.map(arg =>
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' ')
            }, '*');
        }; 
    </script>
  `;

  const srcDoc = `
    <html>
        <head>
            <style>${css}</style>
        </head>
        <body>
            ${html}
            ${interceptorScript}
            <script>${js}</script>
        </body>
    </html>
   `;

  return (
    <section className="flex flex-col h-full bg-surface overflow-hidden">
      {/* Cabecera de la Vista Previa */}
      <header className="p-3 bg-canvas text-xs font-bold uppercase tracking-widest text-dim border-b border-line">
        {title}
      </header>
      
      {/* Lienzo del iframe */}
      <div className="flex-1 bg-white h-full">
        <iframe
          srcDoc={srcDoc}
          title="preview"
          sandbox="allow-scripts"
          width="100%"
          height="100%"
          className="border-none"
        />
      </div>
      
      {/* 💻 CONSOLA DE LOGS REESTRUCTURADA */}
      <div className="flex flex-col h-40 border-t border-line">
        {/* Cabecera de identificación para la consola */}
        <header className="px-3 py-1.5 bg-canvas text-[10px] font-bold uppercase tracking-widest text-green-600 dark:text-green-400 border-b border-line">
          Console
        </header>
        
        {/* Cuerpo de los mensajes */}
        <div className="flex-1 bg-surface text-main font-mono text-xs p-3 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-dim italic opacity-50">No hay registros en consola...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="border-b border-line/30 py-1 text-main">
                {`> ${log}`}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default PreviewPane;