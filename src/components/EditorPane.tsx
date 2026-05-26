import { Editor } from "@monaco-editor/react";

interface EditorPaneProps {
  title: string;
  value: string;
  colorClass: string;
  language: "html" | "css" | "javascript";
  onChange: (newValue: string) => void;
}

function EditorPane({title, value, colorClass, language, onChange}: EditorPaneProps) {
  return (
    <>
      <section className="flex flex-col border-gray-700 h-full overflow-hidden">
        <header className="p-2 bg-gray-800 text-xs font-bold uppercase tracking-widest flex">
          <span className={colorClass}>{title}</span>
        </header>

        <Editor 
          height="100%"
          width="100%"
          theme="vs-dark" //tema oscuro de VS Code
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
      </section>
    </>
  );
}

export default EditorPane;