import {create} from 'zustand';

type Theme = 'light' | 'dark';
export type LayoutMode = 'grid' | 'sidebar' | 'tabs';
export type EditorTab = 'html' | 'css' | 'js';
export type DevMode = 'web' | 'algorithms';

export interface LogMessage {
  type: 'log' | 'error' | 'warn' | 'info';
  content: string;
  timestamp: string;
}

interface CodeState {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    
    html: string;
    css: string;
    js: string;
    webJs: string;
    algoJs: string;
    logs: LogMessage[];
    isAiOpen: boolean;
    
    // UI Layout States
    devMode: DevMode;
    layoutMode: LayoutMode;
    activeTab: EditorTab;
    isHtmlCollapsed: boolean;
    isCssCollapsed: boolean;
    isJsCollapsed: boolean;
    editorWidthPercent: number;
    consoleHeightPx: number;
    isConsoleCollapsed: boolean;
    
    // Actions
    setHtml: (code: string) => void;
    setCss: (code: string) => void;
    setJs: (code: string) => void;
    addLog: (log: LogMessage) => void;
    clearLogs: () => void;
    setIsAiOpen: () => void;
    
    // UI Actions
    setDevMode: (mode: DevMode) => void;
    setLayoutMode: (mode: LayoutMode) => void;
    setActiveTab: (tab: EditorTab) => void;
    toggleHtmlCollapsed: () => void;
    toggleCssCollapsed: () => void;
    toggleJsCollapsed: () => void;
    setEditorWidthPercent: (width: number) => void;
    setConsoleHeightPx: (height: number) => void;
    setIsConsoleCollapsed: (collapsed: boolean) => void;
}

const getSavedValue = (key: string, defaultValue: string) => {
  try {
    const saved = localStorage.getItem(key);
    return saved !== null ? saved : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const defaultHtml = '<h1>Hola desde Codeasy </h1>';
const defaultCss = 'h1 { color: #38bdf8; font-family: sans-serif; text-align: center; margin-top: 2rem; }';
const defaultWebJs = 'console.log("¡Editor Listo y conectado!")';
const defaultAlgoJs = '// Escribe tu algoritmo en JavaScript aquí\nconsole.log("¡Listo para resolver algoritmos!");';

export const useCodeStore = create<CodeState>((set) => {
  const initialDevMode = (localStorage.getItem('codeasy_dev_mode') as DevMode) || 'web';
  const initialHtml = getSavedValue('codeasy_html', defaultHtml);
  const initialCss = getSavedValue('codeasy_css', defaultCss);
  const initialWebJs = getSavedValue('codeasy_web_js', defaultWebJs);
  const initialAlgoJs = getSavedValue('codeasy_algo_js', defaultAlgoJs);
  const initialJs = initialDevMode === 'web' ? initialWebJs : initialAlgoJs;

  return {
    html: initialHtml,
    css: initialCss,
    webJs: initialWebJs,
    algoJs: initialAlgoJs,
    js: initialJs,
    logs: [],
    isAiOpen: false,
    theme: 'light',
    
    // Default Layout Values
    devMode: initialDevMode,
    layoutMode: 'grid',
    activeTab: 'html',
    isHtmlCollapsed: false,
    isCssCollapsed: false,
    isJsCollapsed: false,
    editorWidthPercent: 50,
    consoleHeightPx: 140,
    isConsoleCollapsed: false,
    
    // Core Actions
    setHtml: (code) => set(() => {
      localStorage.setItem('codeasy_html', code);
      return { html: code };
    }),
    setCss: (code) => set(() => {
      localStorage.setItem('codeasy_css', code);
      return { css: code };
    }),
    setJs: (code) => set((state) => {
      if (state.devMode === 'web') {
        localStorage.setItem('codeasy_web_js', code);
        return { js: code, webJs: code };
      } else {
        localStorage.setItem('codeasy_algo_js', code);
        return { js: code, algoJs: code };
      }
    }),
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    clearLogs: () => set({ logs: [] }),
    setTheme: (theme) => set({ theme }),
    setIsAiOpen: () => set((state) => ({isAiOpen: !state.isAiOpen})),
    
    // UI Actions
    setDevMode: (devMode) => set((state) => {
      localStorage.setItem('codeasy_dev_mode', devMode);
      const nextJs = devMode === 'web' ? state.webJs : state.algoJs;
      return { 
        devMode,
        js: nextJs
      };
    }),
    setLayoutMode: (layoutMode) => set({ layoutMode }),
    setActiveTab: (activeTab) => set({ activeTab }),
    toggleHtmlCollapsed: () => set((state) => ({ isHtmlCollapsed: !state.isHtmlCollapsed })),
    toggleCssCollapsed: () => set((state) => ({ isCssCollapsed: !state.isCssCollapsed })),
    toggleJsCollapsed: () => set((state) => ({ isJsCollapsed: !state.isJsCollapsed })),
    setEditorWidthPercent: (editorWidthPercent) => set({ editorWidthPercent }),
    setConsoleHeightPx: (consoleHeightPx) => set({ consoleHeightPx }),
    setIsConsoleCollapsed: (isConsoleCollapsed) => set({ isConsoleCollapsed }),
  };
});
