import { useCodeStore, type LayoutMode } from "../../store/useCodeStore";
import logoLight from "../../assets/icon_light.avif";
import logoDark from "../../assets/icon_black.avif";
import ThemeToggler from "../ThemeToggler/ThemeToggler";
import { BrainCircuit, LayoutGrid, Columns3, Layers } from "lucide-react";

function TopBar() {
  const { theme, setTheme, isAiOpen, setIsAiOpen, layoutMode, setLayoutMode } = useCodeStore();
  const isDarkMode = theme === 'dark';

  const layouts: { mode: LayoutMode; label: string; icon: React.ComponentType<any> }[] = [
    { mode: 'grid', label: 'Cuadrícula', icon: LayoutGrid },
    { mode: 'sidebar', label: 'Sidebar (Apilado)', icon: Columns3 },
    { mode: 'tabs', label: 'Pestañas', icon: Layers },
  ];

  return (
    <header 
      className={`h-11 w-full flex items-center justify-between px-4 select-none transition-colors duration-200 border-b z-20 shrink-0
        ${isDarkMode 
          ? "bg-surface border-line" 
          : "bg-white border-slate-200"
        }
      `}
    >
      {/* LOGO */}
      <div className="flex items-center gap-2 font-bold text-sm tracking-tight text-main">
        <img 
          src={isDarkMode ? logoDark : logoLight} 
          alt="Codeasy logo" 
          className="h-6 w-auto"
        />
        <span 
          style={{ color: isDarkMode ? '#f8fafc' : '#0f172a' }}
          className="font-extrabold text-sm tracking-tight"
        >
          Codeasy
        </span>
        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-canvas border border-line text-dim scale-90">
          v1.2
        </span>
      </div>

      {/* SELECTOR DE LAYOUT (SEGMENTED CONTROL) */}
      <div className="flex items-center rounded-lg bg-canvas p-0.5 border border-line scale-95 shadow-xs">
        {layouts.map(({ mode, label, icon: Icon }) => {
          const isActive = layoutMode === mode;
          return (
            <button
              key={mode}
              onClick={() => setLayoutMode(mode)}
              title={label}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer select-none
                ${isActive 
                  ? "bg-surface text-brand shadow-xs border border-line/30" 
                  : "text-dim hover:text-main"
                }
              `}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-brand" : "text-dim"}`} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          );
        })}
      </div>

      {/* CONTROLES DERECHOS */}
      <div className="flex items-center gap-3">
        {/* BOTÓN ASISTENTE IA */}
        <button
          onClick={() => setIsAiOpen()}
          aria-label="Abrir asistente de IA"
          title="Asistente IA local (Gemini)"
          className={`p-1.5 rounded-lg border cursor-pointer transition-all duration-200 scale-95 hover:shadow-xs
            ${isAiOpen 
              ? "bg-brand text-white border-brand shadow-sm animate-pulse" 
              : "bg-canvas text-main border-line hover:border-brand/40"
            }`}
        >
          <BrainCircuit className="w-4 h-4" />
        </button>

        {/* SELECTOR DE TEMA */}
        <div className="flex items-center scale-90 border-l border-line/50 pl-3">
          <ThemeToggler 
            darkMode={isDarkMode} 
            setDarkMode={(value) => setTheme(value ? 'dark' : 'light')} 
          />
        </div>
      </div>
    </header>
  );
}

export default TopBar;