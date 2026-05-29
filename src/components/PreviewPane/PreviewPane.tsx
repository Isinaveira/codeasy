import { useCodeStore } from "../../store/useCodeStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect, useRef } from "react";
import { Trash2, Globe, Terminal, ChevronDown, ChevronUp } from "lucide-react";

interface IPreviewPaneProps {
  title: string;
}

function PreviewPane({ title }: IPreviewPaneProps) {
  const { 
    html, 
    css, 
    js, 
    logs, 
    clearLogs,
    consoleHeightPx,
    setConsoleHeightPx,
    isConsoleCollapsed,
    setIsConsoleCollapsed
  } = useCodeStore();

  const debouncedHtml = useDebounce(html, 500);
  const debouncedCss = useDebounce(css, 500);
  const debouncedJs = useDebounce(js, 500);

  const consoleEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, isConsoleCollapsed]);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = consoleHeightPx;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = startHeight - deltaY;
      
      // Clamp between 60px and 450px
      if (newHeight >= 60 && newHeight <= 450) {
        setConsoleHeightPx(newHeight);
        if (isConsoleCollapsed) {
          setIsConsoleCollapsed(false);
        }
      }
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

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
    <section ref={containerRef} className="flex flex-col h-full bg-surface overflow-hidden border border-line/45 rounded-lg shadow-2xs">
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
      
      {/* 💻 CONSOLA DE LOGS REESTRUCTURADA */}
      <div 
        className="flex flex-col border-t border-line/70 shrink-0 relative transition-all duration-200"
        style={{ height: isConsoleCollapsed ? "30px" : `${consoleHeightPx}px` }}
      >
        {/* RESIZE DIVIDER HANDLE */}
        <div 
          onMouseDown={startResize}
          className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize hover:bg-brand/50 transition-colors z-20"
        />

        {/* Cabecera de identificación para la consola */}
        <header 
          onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
          className="px-3.5 h-[30px] bg-canvas text-[9px] font-bold uppercase tracking-wider text-dim border-b border-line flex justify-between items-center select-none cursor-pointer hover:bg-line/40 shrink-0"
        >
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-emerald-500" />
            <span>Console</span>
            {logs.length > 0 && (
              <span className="bg-emerald-500/10 text-emerald-500 text-[8px] font-bold px-1.5 py-0.2 rounded-full shrink-0 border border-emerald-500/20">
                {logs.length}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {logs.length > 0 && !isConsoleCollapsed && (
              <button
                onClick={clearLogs}
                title="Clear Console"
                className="p-1 rounded text-dim hover:text-red-500 hover:bg-line/50 transition-colors cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => setIsConsoleCollapsed(!isConsoleCollapsed)}
              className="p-1 rounded text-dim hover:text-main transition-colors cursor-pointer shrink-0"
            >
              {isConsoleCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </header>
        
        {/* Cuerpo de los mensajes */}
        {!isConsoleCollapsed && (
          <div className="flex-1 bg-surface font-mono text-xs overflow-y-auto min-h-0">
            {logs.length === 0 ? (
              <div className="p-3 text-dim italic opacity-50 select-none text-[11px]">
                No hay registros en consola...
              </div>
            ) : (
              <div className="flex flex-col">
                {logs.map((log, index) => (
                  <div 
                    key={index} 
                    className={`border-b border-line/20 px-3.5 py-1.5 flex items-start gap-2 text-[11px] ${getLogStyle(log.type)}`}
                  >
                    <span className="text-dim opacity-50 shrink-0 select-none text-[9px] font-sans">[{log.timestamp}]</span>
                    <span className="shrink-0 select-none font-bold text-[9px]">{getLogPrefix(log.type)}</span>
                    <span className="whitespace-pre-wrap break-all flex-1 tracking-tight">{log.content}</span>
                  </div>
                ))}
                <div ref={consoleEndRef} />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PreviewPane;