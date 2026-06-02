import { Sun, Moon } from "lucide-react";

interface ThemeTogglerProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function ThemeToggler({ darkMode, setDarkMode }: ThemeTogglerProps) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      type="button"
      className="relative w-14 h-7 rounded-full bg-canvas hover:bg-line/45 border border-line cursor-pointer transition-all duration-300 select-none overflow-hidden"
      aria-label="Alternar modo de color"
    >
      {/* Icono del Sol (Light) */}
      <Sun 
        className={`absolute left-[7px] top-[7px] w-3.5 h-3.5 transition-all duration-500 z-10 pointer-events-none
          ${darkMode 
            ? 'text-dim opacity-50 scale-75 rotate-90' 
            : 'text-white scale-100 rotate-0'
          }`} 
      />
      
      {/* Icono de la Luna (Dark) */}
      <Moon 
        className={`absolute left-[35px] top-[7px] w-3.5 h-3.5 transition-all duration-500 z-10 pointer-events-none
          ${darkMode 
            ? 'text-slate-900 scale-100 rotate-0' 
            : 'text-dim opacity-50 scale-75 -rotate-90'
          }`} 
      />

      {/* Deslizador (Esfera Interior) */}
      <div 
        className={`absolute top-1 bottom-1 w-5 h-5 rounded-full bg-brand shadow-md transition-all duration-300 ease-out
          ${darkMode 
            ? "left-8" 
            : "left-1"
          }
        `}
      />
    </button>
  );
}