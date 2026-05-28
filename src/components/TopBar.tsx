import { useCodeStore } from "../store/useCodeStore";
import logoLight from "../assets/icon_light.avif";
import logoDark from "../assets/icon_black.avif";
import ThemeToggler from "./ThemeToggler";

function TopBar() {
    const { theme, setTheme } = useCodeStore();
    const isDarkMode = theme === 'dark';

    return (
        /* 
          💡 TRUCO DE FUERZA BRUTA: 
          Si Tailwind v4 se lía con la herencia de bg-surface en el header,
          forzamos los colores exactos inyectando la condición directamente en la clase.
        */
        <header 
          className={`h-16 w-full flex items-center justify-between px-6 select-none transition-colors duration-200 border-b
            ${isDarkMode 
              ? "bg-surface border-line" 
              : "bg-white border-zinc-200"
            }
          `}
        >
          
          {/* Logo y Nombre */}
          <div className="flex items-center gap-2 font-semibold">
            <img 
              src={isDarkMode ? logoDark : logoLight} 
              alt="Codeasy logo" 
              className="h-10 w-auto"
            />
            Codeasy
          </div>

          {/* Zona del Botón: Le pasamos el estado real de Zustand al Toggler */}
          <div className="flex items-center gap-4">
            <ThemeToggler 
              darkMode={isDarkMode} 
              setDarkMode={(value) => setTheme(value ? 'dark' : 'light')} 
            />
          </div>

        </header>
    );
}

export default TopBar;