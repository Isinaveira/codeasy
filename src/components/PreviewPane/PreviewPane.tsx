import { useCodeStore } from "../../store/useCodeStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect, useRef } from "react";
import { Trash2 } from "lucide-react";

interface IPreviewPaneProps {
  title: string;
}

function PreviewPane({ title }: IPreviewPaneProps) {
  const { html, css, js, logs, clearLogs } = useCodeStore();

  const debouncedHtml = useDebounce(html, 500);
  const debouncedCss = useDebounce(css, 500);
  const debouncedJs = useDebounce(js, 500);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

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
            <style>${debouncedCss}</style>
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

  const getLogStyle = (type: 'log' | 'error' | 'warn' | 'info') => {
    switch (type) {
      case 'error':
        return 'text-red-500 bg-red-500/5 dark:bg-red-500/10 border-red-500/10';
      case 'warn':
        return 'text-amber-600 dark:text-amber-500 bg-amber-500/5 dark:bg-amber-500/10 border-amber-500/10';
      case 'info':
        return 'text-sky-600 dark:text-sky-500 bg-sky-500/5 dark:bg-sky-500/10 border-sky-500/10';
      default:
        return 'text-main border-line/30';
    }
  };

  const getLogPrefix = (type: 'log' | 'error' | 'warn' | 'info') => {
    switch (type) {
      case 'error':
        return '❌';
      case 'warn':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '>';
    }
  };

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
        <header className="px-3 py-1.5 bg-canvas text-[10px] font-bold uppercase tracking-widest text-gray-600 dark:text-white-400 border-b border-line flex justify-between items-center select-none">
          <span>Console</span>
          {logs.length > 0 && (
            <button
              onClick={clearLogs}
              title="Clear Console"
              className="p-1 rounded text-dim hover:text-red-500 hover:bg-line transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </header>
        
        {/* Cuerpo de los mensajes */}
        <div className="flex-1 bg-surface font-mono text-xs overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-3 text-dim italic opacity-50 select-none">No hay registros en consola...</div>
          ) : (
            <div className="flex flex-col">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className={`border-b border-line/20 px-3 py-1.5 flex items-start gap-2 ${getLogStyle(log.type)}`}
                >
                  <span className="text-dim opacity-50 shrink-0 select-none text-[10px]">[{log.timestamp}]</span>
                  <span className="shrink-0 select-none font-bold text-[10px]">{getLogPrefix(log.type)}</span>
                  <span className="whitespace-pre-wrap break-all flex-1">{log.content}</span>
                </div>
              ))}
              <div ref={consoleEndRef} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PreviewPane;