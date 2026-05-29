import { useCodeStore } from "../../store/useCodeStore";
import logoLight from "../../assets/icon_light.avif";
import logoDark from "../../assets/icon_black.avif";
import ThemeToggler from "../ThemeToggler/ThemeToggler";
import { BrainCircuit } from "lucide-react";
function TopBar() {
    const { theme, setTheme, isAiOpen, setIsAiOpen } = useCodeStore();
    const isDarkMode = theme === 'dark';

    return (
        
        <header 
          className={`h-16 w-full flex items-center justify-between px-6 select-none transition-colors duration-200 border-b
            ${isDarkMode 
              ? "bg-surface border-line" 
              : "bg-white border-zinc-200"
            }
          `}
        >
          
          <div className="flex items-center gap-2 font-semibold">
            <img 
              src={isDarkMode ? logoDark : logoLight} 
              alt="Codeasy logo" 
              className="h-10 w-auto"
            />
            Codeasy
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsAiOpen()}
              aria-label="Abrir asistente de IA"
              className={`p-2 rounded-lg border border-line cursor-pointer transition-colors text-xs font-bold 
                ${isAiOpen ? "bg-brand text-white border-brand" : "bg-canvas text-main hover:border-brand"}`}
            >
              <BrainCircuit className="w-5 h-5"/>
            </button>
            <ThemeToggler 
              darkMode={isDarkMode} 
              setDarkMode={(value) => setTheme(value ? 'dark' : 'light')} 
            />
          </div>

        </header>
    );
}

export default TopBar;