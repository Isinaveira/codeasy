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
      className="relative w-14 h-7 rounded-full bg-canvas hover:bg-line/45 border border-line p-1 cursor-pointer flex items-center justify-between transition-all duration-300 select-none overflow-hidden"
      aria-label="Alternar modo de color"
    >
      {/* Icono del Sol (Light) */}
      <Sun 
        className={`w-3.5 h-3.5 text-amber-500 transition-all duration-500 z-10 
          ${darkMode 
            ? 'opacity-30 scale-75 rotate-90 translate-x-[-2px]' 
            : 'opacity-100 scale-100 rotate-0'
          }`} 
      />
      
      {/* Icono de la Luna (Dark) */}
      <Moon 
        className={`w-3.5 h-3.5 text-sky-400 transition-all duration-500 z-10 
          ${darkMode 
            ? 'opacity-100 scale-100 rotate-0' 
            : 'opacity-30 scale-75 -rotate-90 translate-x-[2px]'
          }`} 
      />

      {/* Deslizador (Esfera Interior) */}
      <div 
        className={`absolute top-1 bottom-1 w-5 h-5 rounded-full bg-brand shadow-md transition-all duration-300 ease-out flex items-center justify-center
          ${darkMode 
            ? "left-[30px]" 
            : "left-1"
          }
        `}
      >
        <div className="w-1.5 h-1.5 rounded-full bg-surface/80" />
      </div>
    </button>
  );
}