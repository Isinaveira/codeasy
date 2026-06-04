import { diffWords } from "diff";

interface ImportDiffModalProps {
  currentCode: string;
  suggestedCode: string;
  language: string;
  onAccept: () => void;
  onClose: () => void;
}

export default function ImportDiffModal({
  currentCode,
  suggestedCode,
  language,
  onAccept,
  onClose,
}: ImportDiffModalProps) {
  const changes = diffWords(currentCode, suggestedCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface border border-line rounded-xl shadow-xl w-[600px] max-w-[90vw] max-h-[80vh] flex flex-col">
        <header className="flex items-center justify-between px-5 py-3 border-b border-line">
          <h2 className="text-sm font-bold uppercase tracking-widest text-main">
            Importar {language.toUpperCase()}
          </h2>
          <span className="text-[10px] text-dim italic">
            Ctrl+Z para deshacer
          </span>
        </header>

        <div className="flex-1 overflow-auto p-4 grid grid-cols-2 gap-4 text-xs font-mono">
          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-dim mb-2 font-semibold">
              Actual
            </h3>
            <pre className="bg-[#1e1e2e] text-[#cdd6f4] p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {currentCode || <span className="text-dim italic">(vacío)</span>}
            </pre>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-wider text-dim mb-2 font-semibold">
              Sugerido
            </h3>
            <pre className="bg-[#1e1e2e] text-[#cdd6f4] p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
              {changes.map((part, i) => (
                <span
                  key={i}
                  className={
                    part.added
                      ? "bg-green-600/30 text-green-300"
                      : part.removed
                        ? "bg-red-600/30 text-red-300"
                        : ""
                  }
                >
                  {part.value}
                </span>
              ))}
            </pre>
          </div>
        </div>

        <footer className="flex justify-end gap-2 px-5 py-3 border-t border-line">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-lg border border-line bg-canvas text-main hover:bg-surface transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-brand text-white hover:bg-brand-hover transition-colors cursor-pointer"
          >
            Aceptar cambios
          </button>
        </footer>
      </div>
    </div>
  );
}
