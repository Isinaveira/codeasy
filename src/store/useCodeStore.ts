import {create} from 'zustand';

type Theme = 'light' | 'dark';
export type LayoutMode = 'grid' | 'sidebar' | 'tabs';
export type EditorTab = 'html' | 'css' | 'js';

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
    logs: LogMessage[];
    isAiOpen: boolean;
    
    // UI Layout States
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
    setLayoutMode: (mode: LayoutMode) => void;
    setActiveTab: (tab: EditorTab) => void;
    toggleHtmlCollapsed: () => void;
    toggleCssCollapsed: () => void;
    toggleJsCollapsed: () => void;
    setEditorWidthPercent: (width: number) => void;
    setConsoleHeightPx: (height: number) => void;
    setIsConsoleCollapsed: (collapsed: boolean) => void;
}

export const useCodeStore = create<CodeState>((set) => ({
    html: '<h1>Hola desde Codeasy </h1>',
    css: 'h1 { color: #38bdf8; font-family: sans-serif; text-align: center; margin-top: 2rem; }',
    js: 'console.log("¡Editor Listo y conectado!")',
    logs: [],
    isAiOpen: false,
    theme: 'light',
    
    // Default Layout Values
    layoutMode: 'grid',
    activeTab: 'html',
    isHtmlCollapsed: false,
    isCssCollapsed: false,
    isJsCollapsed: false,
    editorWidthPercent: 50,
    consoleHeightPx: 140,
    isConsoleCollapsed: false,
    
    // Core Actions
    setHtml: (code) => set({html: code}),
    setCss: (code) => set({css: code}),
    setJs: (code) => set({ js: code}),
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    clearLogs: () => set({ logs: [] }),
    setTheme: (theme) => set({ theme }),
    setIsAiOpen: () => set((state) => ({isAiOpen: !state.isAiOpen})),
    
    // UI Actions
    setLayoutMode: (layoutMode) => set({ layoutMode }),
    setActiveTab: (activeTab) => set({ activeTab }),
    toggleHtmlCollapsed: () => set((state) => ({ isHtmlCollapsed: !state.isHtmlCollapsed })),
    toggleCssCollapsed: () => set((state) => ({ isCssCollapsed: !state.isCssCollapsed })),
    toggleJsCollapsed: () => set((state) => ({ isJsCollapsed: !state.isJsCollapsed })),
    setEditorWidthPercent: (editorWidthPercent) => set({ editorWidthPercent }),
    setConsoleHeightPx: (consoleHeightPx) => set({ consoleHeightPx }),
    setIsConsoleCollapsed: (isConsoleCollapsed) => set({ isConsoleCollapsed }),
}));
