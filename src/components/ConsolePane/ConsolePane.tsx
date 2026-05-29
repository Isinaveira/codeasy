import { useCodeStore } from "../../store/useCodeStore";
import { useEffect, useRef } from "react";
import { Trash2, Terminal, ChevronDown, ChevronUp } from "lucide-react";

export default function ConsolePane() {
  const { 
    logs, 
    clearLogs,
    consoleHeightPx,
    setConsoleHeightPx,
    isConsoleCollapsed,
    setIsConsoleCollapsed
  } = useCodeStore();

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new logs
  useEffect(() => {
    if (consoleEndRef.current && !isConsoleCollapsed) {
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
    <div 
      className="flex flex-col border-t border-line/70 shrink-0 relative transition-all duration-200 bg-surface rounded-b-lg overflow-hidden"
      style={{ height: isConsoleCollapsed ? "30px" : `${consoleHeightPx}px` }}
    >
      {/* RESIZE DIVIDER HANDLE */}
      <div 
        onMouseDown={startResize}
        className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize hover:bg-brand/50 transition-colors z-20"
      />

      {/* CABECERA */}
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
      
      {/* LOG MESSAGES LIST */}
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
  );
}
