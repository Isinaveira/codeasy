import { Editor } from "@monaco-editor/react";

interface EditorPaneProps {
  title: string;
  value: string;
  colorClass: string;
  language: "html" | "css" | "javascript";
  onChange: (newValue: string) => void;
  theme: "dark" | "light";
}

function EditorPane({title, value, colorClass, language, onChange, theme}: EditorPaneProps) {
  return (
    <section className="flex flex-col h-full overflow-hidden bg-surface">
      {/* Corregido bg-bg-canvas por bg-canvas */}
      <header className="p-3 bg-canvas text-xs font-bold uppercase tracking-widest flex border-b border-line">
        <span className={colorClass}>{title}</span>
      </header>

      <div className="flex-1 w-full overflow-hidden">
        <Editor 
          height="100%"
          width="100%"
          theme={(theme === "dark") ? 'vs-dark': 'vs'} 
          language={language}
          value={value}
          onChange={(value) => onChange(value || '')}
          options={{
            minimap: {enabled: false},
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            tabSize: 2,
            scrollBeyondLastLine: false
          }}        
        />
      </div>
    </section>
  );
}

export default EditorPane;