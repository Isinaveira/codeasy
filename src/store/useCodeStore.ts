import {create} from 'zustand';

type Theme = 'light' | 'dark';

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
    
    //actions
    setHtml: (code: string) => void;
    setCss: (code: string) => void;
    setJs: (code: string) => void;
    addLog: (log: LogMessage) => void;
    clearLogs: () => void;
    setIsAiOpen: () => void;
}

export const useCodeStore = create<CodeState>((set) => ({
    html: '<h1>Hola desde Codeasy </h1>',
    css: 'h1{ color: gray; }',
    js: 'console.log("¡Editor Listo!")',
    logs: [],
    isAiOpen: false,
    setHtml: (code) => set({html: code}),
    setCss: (code) => set({css: code}),
    setJs: (code) => set({ js: code}),
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    clearLogs: () => set({ logs: [] }),
    theme:'light',
    setTheme: (theme) => set({ theme }),
    setIsAiOpen: () => set((state) => ({isAiOpen: !state.isAiOpen})),
}));

