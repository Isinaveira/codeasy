import { useCodeStore } from "../../store/useCodeStore";
import { useDebounce } from "../../hooks/useDebounce";
import { Globe } from "lucide-react";
import ConsolePane from "../ConsolePane/ConsolePane";

interface IPreviewPaneProps {
  title: string;
}

function PreviewPane({ title }: IPreviewPaneProps) {
  const { html, css, js } = useCodeStore();

  const debouncedHtml = useDebounce(html, 1200);
  const debouncedCss = useDebounce(css, 1200);
  const debouncedJs = useDebounce(js, 1200);

  const interceptorScript = `
    <script>
        const getTimestamp = () => {
          const now = new Date();
          return now.toTimeString().split(' ')[0];
        };

        const formatArg = (arg) => {
          try {
            if (arg === null) return 'null';
            if (arg === undefined) return 'undefined';
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
          } catch (e) {
            return '[Circular Object]';
          }
        };

        const sendLog = (logType, args) => {
          window.parent.postMessage({
              type: 'CONSOLE_LOG',
              logType: logType,
              content: args.map(formatArg).join(' '),
              timestamp: getTimestamp()
          }, '*');
        };

        const oldLog = console.log;
        console.log = function(...args) {
            oldLog.apply(console, args);
            sendLog('log', args);
        };

        const oldError = console.error;
        console.error = function(...args) {
            oldError.apply(console, args);
            sendLog('error', args);
        };

        const oldWarn = console.warn;
        console.warn = function(...args) {
            oldWarn.apply(console, args);
            sendLog('warn', args);
        };

        const oldInfo = console.info;
        console.info = function(...args) {
            oldInfo.apply(console, args);
            sendLog('info', args);
        };

        // Capturar errores no controlados en tiempo de ejecución
        window.addEventListener('error', function(event) {
            sendLog('error', [event.message + ' (' + event.filename.split('/').pop() + ':' + event.lineno + ')']);
        });
    </script>
  `;

  const srcDoc = `
    <html>
        <head>
            <style>
              body { 
                margin: 0; 
                padding: 12px; 
                color: #0f172a; 
                background: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              }
              ${debouncedCss}
            </style>
        </head>
        <body>
            ${debouncedHtml}
            ${interceptorScript}
            <script>
              try {
                ${debouncedJs}
              } catch (e) {
                console.error(e.message);
              }
            </script>
        </body>
    </html>
   `;

  return (
    <section id="preview-pane-container" className="flex flex-col h-full bg-surface overflow-hidden border border-line/45 rounded-lg shadow-2xs">
      {/* Cabecera de la Vista Previa */}
      <header className="px-3 py-2 bg-canvas text-[10px] font-bold uppercase tracking-wider text-dim border-b border-line/50 flex items-center gap-1.5 select-none shrink-0">
        <Globe className="w-3.5 h-3.5 text-brand/70" />
        <span>{title}</span>
      </header>
      
      {/* Lienzo del iframe */}
      <div className="flex-1 bg-white relative">
        <iframe
          srcDoc={srcDoc}
          title="preview"
          sandbox="allow-scripts"
          width="100%"
          height="100%"
          className="border-none bg-white absolute inset-0"
        />
      </div>
      
      {/* CONSOLA DE LOGS INTEGRADA */}
      <ConsolePane />
    </section>
  );
}

export default PreviewPane;