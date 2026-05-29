import { Editor } from "@monaco-editor/react";
import { FileCode, FileText, Blocks, ChevronDown, ChevronRight } from "lucide-react";

interface EditorPaneProps {
  title: string;
  value: string;
  colorClass: string;
  language: "html" | "css" | "javascript";
  onChange: (newValue: string) => void;
  theme: "dark" | "light";
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

function EditorPane({
  title,
  value,
  colorClass,
  language,
  onChange,
  theme,
  isCollapsible = false,
  isCollapsed = false,
  onToggleCollapse
}: EditorPaneProps) {
  
  // Icon selector per language
  const getIcon = () => {
    switch (language) {
      case "html":
        return <FileCode className="w-3.5 h-3.5 text-orange-500 shrink-0" />;
      case "css":
        return <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0" />;
      case "javascript":
        return <Blocks className="w-3.5 h-3.5 text-amber-500 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <section 
      className={`flex flex-col overflow-hidden bg-surface transition-all duration-200 border border-line/45 rounded-lg shadow-2xs h-full w-full
        ${isCollapsed ? "h-auto flex-none shrink-0" : "flex-1 min-h-[40px]"}
      `}
    >
      {/* HEADER */}
      <header 
        onClick={isCollapsible && onToggleCollapse ? onToggleCollapse : undefined}
        className={`px-3 py-2 bg-canvas text-[10px] font-bold uppercase tracking-wider flex items-center justify-between select-none border-b border-line/50 transition-colors
          ${isCollapsible ? "cursor-pointer hover:bg-line/40" : ""}
        `}
      >
        <div className="flex items-center gap-2">
          {isCollapsible && onToggleCollapse && (
            <span className="text-dim shrink-0">
              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </span>
          )}
          {getIcon()}
          <span className={`${colorClass} font-semibold`}>{title}</span>
        </div>
        
        {/* Extra file-info badge */}
        {!isCollapsed && (
          <span className="text-[9px] font-medium text-dim scale-90 opacity-60">
            {language === 'javascript' ? 'JS ES6' : language.toUpperCase()}
          </span>
        )}
      </header>

      {/* EDITOR WORKSPACE */}
      {!isCollapsed && (
        <div className="flex-1 w-full overflow-hidden bg-surface relative min-h-[80px]">
          <Editor 
            height="100%"
            width="100%"
            theme={(theme === "dark") ? 'vs-dark': 'vs'} 
            language={language}
            value={value}
            onChange={(value) => onChange(value || '')}
            options={{
              minimap: {enabled: false},
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Courier New', Courier, monospace",
              wordWrap: 'on',
              automaticLayout: true,
              tabSize: 2,
              scrollBeyondLastLine: false,
              lineNumbersMinChars: 3,
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on'
            }}        
          />
        </div>
      )}
    </section>
  );
}

export default EditorPane;