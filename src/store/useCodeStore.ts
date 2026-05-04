import {create} from 'zustand';


interface CodeState {
    html: string;
    css: string;
    js: string;
    logs: string[];
    
    //actions
    setHtml: (code: string) => void;
    setCss: (code: string) => void;
    setJs: (code: string) => void;
    addLog: (log: string) => void;
    clearLogs: () => void;
}

export const useCodeStore = create<CodeState>((set) => ({
    html: '<h1>Hola desde Codeasy </h1>',
    css: 'h1{ color: cyan; }',
    js: 'console.log("¡Editor Listo!")',
    logs: [],
    setHtml: (code) => set({html: code}),
    setCss: (code) => set({css: code}),
    setJs: (code) => set({ js: code}),
    addLog: (log) => set((state) => ({ logs: [...state.logs, log] })),
    clearLogs: () => set({ logs: [] }), 
}));

