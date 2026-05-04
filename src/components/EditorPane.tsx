interface EditorPaneProps {
  title: string,
  value: string,
  colorClass: string,
  onChange: (newValue: string) => void
}

function EditorPane({title, value, colorClass, onChange}: EditorPaneProps) {
  return (
    <>
      <section className="border-r border-b border-gray-700 flex flex-col">
        <header className="p-2 bg-gray-800 text-xs font-bold uppercase tracking-widest text-orange-400">
          <span className={colorClass}>{title}</span>
        </header>
        <textarea 
            className="flex-1 p-4 bg-transparent outline-none resize-none font-mono text-sm" 
            value={value}
            spellCheck={false}
            onChange={(e) => onChange(e.target.value)}
        />
      </section>
    </>
  );
}

export default EditorPane;