import { Import } from "lucide-react";

interface CodeBlockProps {
  language: string;
  code: string;
  onImport: () => void;
}

const SUPPORTED = new Set(["html", "css", "js", "javascript"]);

export default function CodeBlock({ language, code, onImport }: CodeBlockProps) {
  const showImport = SUPPORTED.has(language);

  return (
    <div className="relative group">
      <pre className="bg-[#1e1e2e] text-[#cdd6f4] rounded-lg p-4 overflow-x-auto text-xs leading-relaxed my-2">
        <code>{code}</code>
      </pre>
      {showImport && (
        <button
          onClick={onImport}
          className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider bg-brand text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-hover cursor-pointer"
        >
          <Import className="w-3 h-3" />
          Import
        </button>
      )}
    </div>
  );
}
