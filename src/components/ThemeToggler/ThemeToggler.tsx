interface ThemeTogglerProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function ThemeToggler({ darkMode, setDarkMode }: ThemeTogglerProps) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      type="button"
      className="relative w-12 h-6 rounded-full bg-canvas border border-line p-0.5 cursor-pointer"
    >
      <div 
        className={`absolute top-0.5 bottom-0.5 w-5 rounded-full bg-brand transition-all duration-300
          ${darkMode 
            ? "left-full -translate-x-5.5"  /* Posición en modo oscuro */
            : "left-0.5"                    /* Posición en modo claro */
          }
        `}
      />
    </button>
  );
}