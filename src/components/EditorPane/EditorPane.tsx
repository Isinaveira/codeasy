import { Editor } from "@monaco-editor/react";
import { FileCode, FileText, Blocks, ChevronDown, ChevronRight } from "lucide-react";
import { emmetHTML, emmetCSS } from "emmet-monaco-es";

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

  const handleEditorWillMount = (monaco: any) => {
    // Registramos Emmet de forma segura para autocompletado en HTML y CSS
    try {
      emmetHTML(monaco, ["html"]);
      emmetCSS(monaco, ["css"]);
    } catch (e) {
      console.warn("No se pudo iniciar Emmet en este entorno (posiblemente bajo test unitarios):", e);
    }

    // Definimos el tema oscuro premium de Codeasy
    monaco.editor.defineTheme("codeasy-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "64748b", fontStyle: "italic" },
        { token: "keyword", foreground: "38bdf8", fontStyle: "bold" },
        { token: "string", foreground: "34d399" },
        { token: "number", foreground: "fbbf24" },
        { token: "regexp", foreground: "f43f5e" },
        { token: "type", foreground: "a78bfa" },
        { token: "class", foreground: "22d3ee" },
        { token: "function", foreground: "60a5fa" }
      ],
      colors: {
        "editor.background": "#0f1626", // Fondo marino idéntico a --surface
        "editor.lineHighlightBackground": "#1e293b22",
        "editorLineNumber.foreground": "#475569",
        "editorLineNumber.activeForeground": "#38bdf8",
        "editor.selectionBackground": "#38bdf825",
        "editor.inactiveSelectionBackground": "#38bdf811",
      },
    });

    // Definimos el tema claro premium de Codeasy
    monaco.editor.defineTheme("codeasy-light", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "comment", foreground: "94a3b8", fontStyle: "italic" },
        { token: "keyword", foreground: "0f172a", fontStyle: "bold" },
        { token: "string", foreground: "10b981" },
        { token: "number", foreground: "f59e0b" },
        { token: "function", foreground: "2563eb" }
      ],
      colors: {
        "editor.background": "#ffffff", // Fondo blanco limpio idéntico a --surface
        "editor.lineHighlightBackground": "#f1f3f777",
        "editorLineNumber.foreground": "#cbd5e1",
        "editorLineNumber.activeForeground": "#0f172a",
        "editor.selectionBackground": "#0f172a12",
        "editor.inactiveSelectionBackground": "#0f172a08",
      },
    });
  };

  return (
    <section 
      id={`editor-pane-${language}`}
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
            theme={theme === "dark" ? "codeasy-dark" : "codeasy-light"} 
            beforeMount={handleEditorWillMount}
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