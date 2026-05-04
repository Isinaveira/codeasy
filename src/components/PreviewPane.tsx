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
    <>
      <section className="bg-white flex flex-col">
        <header className="p-2 bg-gray-800 text-xs font-bold uppercase tracking-widest text-gray-400">
          {title}
        </header>
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
        <div className="bg-black text-green-500 font-mono text-xs p-2 overflow-y-auto h-32">
          {logs.map((log, index) => (
            <div key={index} className="border-b border-gray-800 py-1">
              {`> ${log}`}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default PreviewPane;
