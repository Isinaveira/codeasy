import { useState, useEffect } from "react";
import { useCodeStore, type LayoutMode } from "../../store/useCodeStore";
import logoLight from "../../assets/icon_light.avif";
import logoDark from "../../assets/icon_black.avif";
import ThemeToggler from "../ThemeToggler/ThemeToggler";
import { BrainCircuit, LayoutGrid, Columns3, Layers, Globe, Code2, Save, Download, Check } from "lucide-react";

function TopBar() {
  const { 
    theme, 
    setTheme, 
    isAiOpen, 
    setIsAiOpen, 
    layoutMode, 
    setLayoutMode,
    devMode,
    setDevMode,
    html,
    css,
    webJs,
    algoJs
  } = useCodeStore();
  
  const isDarkMode = theme === 'dark';

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Cerrar el menú desplegable al hacer clic fuera de él
  useEffect(() => {
    if (!showDropdown) return;
    const handleOutsideClick = () => setShowDropdown(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showDropdown]);

  const handleSave = () => {
    // El store de Zustand ya gestiona el auto-guardado en localStorage,
    // pero esta acción explícita le da seguridad al usuario con un Toast de feedback visual.
    if (devMode === 'web') {
      localStorage.setItem('codeasy_html', html);
      localStorage.setItem('codeasy_css', css);
      localStorage.setItem('codeasy_web_js', webJs);
      setToastMessage("¡Proyecto web guardado en tu navegador!");
    } else {
      localStorage.setItem('codeasy_algo_js', algoJs);
      setToastMessage("¡Algoritmo guardado en tu navegador!");
    }
    setShowToast(true);
    const timer = setTimeout(() => {
      setShowToast(false);
    }, 3000);
    return () => clearTimeout(timer);
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSingleHTML = () => {
    const combinedHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Proyecto Web Codeasy</title>
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${webJs}
  </script>
</body>
</html>`;
    
    downloadFile("proyecto-codeasy.html", combinedHTML, "text/html");
    setShowDropdown(false);
  };

  const handleDownloadAlgoJS = () => {
    downloadFile("algoritmo.js", algoJs, "application/javascript");
    setShowDropdown(false);
  };

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
      {/* LOGO Y SELECTOR DE MODO */}
      <div className="flex items-center gap-4">
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

        {/* SELECTOR DE MODO (WEB / ALGORITHMS) */}
        <div className="flex items-center rounded-lg bg-canvas p-0.5 border border-line scale-90 shadow-2xs">
          <button
            onClick={() => setDevMode('web')}
            title="Modo Desarrollo Web Completo"
            className={`flex items-center gap-1.5 px-2.5 py-0.7 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none
              ${devMode === 'web' 
                ? 'bg-surface text-brand shadow-3xs border border-line/30' 
                : 'text-dim hover:text-main'
              }`}
          >
            <Globe className="w-3 h-3 text-brand" />
            <span>Web</span>
          </button>
          
          <button
            onClick={() => setDevMode('algorithms')}
            title="Modo Algoritmos y Estructuras"
            className={`flex items-center gap-1.5 px-2.5 py-0.7 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none
              ${devMode === 'algorithms' 
                ? 'bg-surface text-brand shadow-3xs border border-line/30' 
                : 'text-dim hover:text-main'
              }`}
          >
            <Code2 className="w-3 h-3 text-brand" />
            <span>Algoritmos</span>
          </button>
        </div>
      </div>

      {/* SELECTOR DE LAYOUT EN MEDIO */}
      {devMode === 'web' ? (
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
      ) : (
        <div className="w-1" />
      )}

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

        {/* BOTÓN GUARDAR Y EXPORTAR */}
        <div className="relative flex items-center bg-canvas rounded-lg border border-line scale-95 shadow-2xs">
          {/* BOTÓN GUARDAR EXPLÍCITO */}
          <button
            onClick={handleSave}
            title="Guardar código en navegador"
            className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-main hover:text-brand hover:bg-canvas transition-colors cursor-pointer rounded-l-lg border-r border-line select-none"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Guardar</span>
          </button>
          
          {/* BOTÓN DROPDOWN EXPORTACIÓN */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            title="Exportar / Descargar código"
            className="px-2 py-1.5 text-main hover:text-brand hover:bg-canvas transition-colors cursor-pointer rounded-r-lg flex items-center justify-center select-none"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* MENÚ DESPLEGABLE DE EXPORTACIÓN */}
          {showDropdown && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-surface border border-line rounded-lg shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-widest text-dim border-b border-line/60">
                Opciones de Exportación
              </div>
              {devMode === 'web' ? (
                <>
                  <button
                    onClick={handleDownloadSingleHTML}
                    className="w-full text-left px-3 py-2 text-xs text-main hover:bg-canvas hover:text-brand flex items-center gap-2 cursor-pointer transition-colors border-b border-line/45"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs">HTML Único Completo</span>
                      <span className="text-[9px] text-dim">HTML, CSS y JS integrados</span>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile("index.html", html, "text/html");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-main hover:bg-canvas hover:text-brand flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span className="text-xs">Descargar index.html</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile("style.css", css, "text/css");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-main hover:bg-canvas hover:text-brand flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-xs">Descargar style.css</span>
                  </button>
                  <button
                    onClick={() => {
                      downloadFile("script.js", webJs, "application/javascript");
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-main hover:bg-canvas hover:text-brand flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-xs">Descargar script.js</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleDownloadAlgoJS}
                  className="w-full text-left px-3 py-2 text-xs text-main hover:bg-canvas hover:text-brand flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs">Descargar algoritmo.js</span>
                    <span className="text-[9px] text-dim">Archivo JS de algoritmos</span>
                  </div>
                </button>
              )}
            </div>
          )}
        </div>

        {/* SELECTOR DE TEMA */}
        <div className="flex items-center scale-90 border-l border-line/50 pl-3">
          <ThemeToggler 
            darkMode={isDarkMode} 
            setDarkMode={(value) => setTheme(value ? 'dark' : 'light')} 
          />
        </div>
      </div>

      {/* TOAST DE CONFIRMACIÓN FLOTANTE */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-surface border border-brand/50 text-main rounded-xl px-4 py-3 shadow-lg z-50 flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300 backdrop-blur-md bg-opacity-80">
          <div className="w-7 h-7 bg-brand/10 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-brand" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-main">¡Código guardado!</span>
            <span className="text-[10px] text-dim">{toastMessage}</span>
          </div>
        </div>
      )}
    </header>
  );
}

export default TopBar;