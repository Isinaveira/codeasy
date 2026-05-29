interface DownloadableProps {
  onDownload: () => void;
}

export function CheckingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-dim">Verificando entorno local...</p>
    </div>
  );
}

export function DownloadableScreen({ onDownload }: DownloadableProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <p className="text-xs text-main max-w-xs leading-relaxed">
        Tu ordenador cumple los requisitos. Necesitamos inicializar y descargar el modelo <span className="font-semibold text-brand">Gemini Nano</span> local (aprox. 2-3 GB) en tu navegador.
      </p>
      <button
        onClick={onDownload}
        className="px-4 py-2 bg-brand text-white hover:bg-brand-hover rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm"
      >
        Descargar e Iniciar Asistente
      </button>
    </div>
  );
}

export function DownloadingScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      <p className="text-xs text-main font-semibold">Descargando Gemini Nano en segundo plano...</p>
      <p className="text-[11px] text-dim max-w-xs leading-relaxed">
        Chrome está bajando el modelo de forma nativa (va por unos 4 GB). Puedes ver el porcentaje exacto abriendo una pestaña en 
        <span className="font-mono text-brand block mt-1 select-all">chrome://on-device-internals</span>
      </p>
    </div>
  );
}

export function ConfigErrorScreen() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3">
      <p className="text-xs font-bold text-red-500">Error de compatibilidad</p>
      <p className="text-[11px] text-dim max-w-xs leading-relaxed">
        No se ha detectado el motor local. Asegúrate de tener los flags de <span className="font-mono">chrome://flags</span> activos y suficiente espacio en disco (mínimo 22 GB libres).
      </p>
    </div>
  );
}
