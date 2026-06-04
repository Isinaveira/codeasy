import { useEffect, useState, useRef, type FormEvent } from "react";
import { useCodeStore } from "../store/useCodeStore";
import { useChatStore, type Conversation } from "../store/useChatStore";

export type AssistantStatus = "checking" | "config_error" | "ready" | "downloadable" | "downloading";

export interface Message {
  role: "user" | "assistant";
  text: string;
}

interface LanguageModelCapabilities {
  available: "readily" | "after-download" | "no";
}

interface LanguageModelAvailabilityOptions {
  languages: string[];
}

interface LanguageModelSession {
  prompt: (prompt: string) => Promise<string>;
  destroy?: () => void;
}

interface LanguageModelFactory {
  availability?: (options?: LanguageModelAvailabilityOptions) => Promise<"available" | "downloadable" | "downloading" | "unavailable" | "downloaded">;
  capabilities?: () => Promise<LanguageModelCapabilities>;
  create: (options?: { systemPrompt?: string }) => Promise<LanguageModelSession>;
}

export function useAiAssistant() {
  const { isAiOpen, html, css, js, devMode } = useCodeStore();
  const { conversations, activeId, addConversation, updateConversation, setActiveConversation } = useChatStore();

  const [status, setStatus] = useState<AssistantStatus>("checking");
  const [aiSession, setAiSession] = useState<LanguageModelSession | null>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const detectedApiRef = useRef<LanguageModelFactory | null>(null);
  const aiSessionRef = useRef<LanguageModelSession | null>(null);

  const systemPrompt = devMode === "web"
    ? "Eres un asistente de IA experto en desarrollo web metido en el editor Codeasy. Revisa el código y ayuda de forma concisa en español. El contexto que se te pasará incluye HTML, CSS y JavaScript."
    : "Eres un asistente de IA experto en algoritmos y JavaScript metido en el editor Codeasy. Revisa el código y ayuda de forma concisa en español. El contexto que se te pasará incluye únicamente JavaScript.";

  useEffect(() => {
    const activeConv = useChatStore.getState().conversations.find((c) => c.id === useChatStore.getState().activeId);
    if (activeConv && activeConv.mode !== devMode) {
      useChatStore.getState().clearActiveConversation();
    }
  }, [devMode]);

  useEffect(() => {
    if (!isAiOpen) return;

    const checkAiAvailability = async () => {
      try {
        setStatus("checking");
        let apiTarget: LanguageModelFactory | null = null;
        const win = window as any;

        if (typeof win.LanguageModel !== "undefined") {
          apiTarget = win.LanguageModel;
        } else if ("ai" in win && "assistant" in win.ai) {
          apiTarget = win.ai.assistant;
        } else if ("ai" in win && "languageModel" in win.ai) {
          apiTarget = win.ai.languageModel;
        }

        if (!apiTarget) {
          setStatus("config_error");
          return;
        }

        detectedApiRef.current = apiTarget;
        let state: string = "unavailable";

        if (typeof apiTarget.availability === "function") {
          state = await apiTarget.availability({ languages: ["es"] });
        } else if (typeof apiTarget.capabilities === "function") {
          const caps = await apiTarget.capabilities();
          const capState = caps.available;
          if (capState === "readily") state = "available";
          if (capState === "no") state = "unavailable";
        }

        if (state === "available" || state === "downloaded") {
          if (aiSessionRef.current && typeof aiSessionRef.current.destroy === "function") {
            try { aiSessionRef.current.destroy(); } catch (e) {}
          }
          const session = await apiTarget.create({ systemPrompt });
          aiSessionRef.current = session;
          setAiSession(session);
          setStatus("ready");
        } else if (state === "downloadable") {
          setStatus("downloadable");
        } else if (state === "downloading") {
          setStatus("downloading");
        } else {
          setStatus("config_error");
        }
      } catch (error) {
        setStatus("config_error");
      }
    };

    checkAiAvailability();

    return () => {
      if (aiSessionRef.current && typeof aiSessionRef.current.destroy === "function") {
        try {
          aiSessionRef.current.destroy();
          aiSessionRef.current = null;
        } catch (e) {}
      }
    };
  }, [isAiOpen, devMode]);

  const handleDownload = async () => {
    const apiTarget = detectedApiRef.current;
    if (!apiTarget) return;

    setStatus("downloading");
    try {
      if (aiSessionRef.current && typeof aiSessionRef.current.destroy === "function") {
        try { aiSessionRef.current.destroy(); } catch (e) {}
      }
      const session = await apiTarget.create({ systemPrompt });
      aiSessionRef.current = session;
      setAiSession(session);
      setStatus("ready");
    } catch (error) {
      setStatus("config_error");
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !aiSession || isGenerating) return;

    const userText = inputValue;
    const activeMode = devMode;
    setInputValue("");
    setIsGenerating(true);

    let currentConversation: Conversation | undefined;
    let isNewConversation = false;

    if (!activeId) {
      isNewConversation = true;
      const newId = crypto.randomUUID();
      const newConv: Conversation = {
        id: newId,
        title: "Nueva conversación...",
        mode: activeMode,
        messages: [{ role: "user", text: userText }],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      addConversation(newConv);
      setActiveConversation(newId);
      currentConversation = newConv;
    } else {
      currentConversation = conversations.find((c) => c.id === activeId);
      if (currentConversation) {
        updateConversation(activeId, {
          messages: [...currentConversation.messages, { role: "user", text: userText }]
        });
      }
    }

    const promptConContexto = activeMode === "web"
      ? `[CONTEXTO HTML]\n${html}\n[CONTEXTO CSS]\n${css}\n[CONTEXTO JS]\n${js}\nPregunta: ${userText}`
      : `[CONTEXTO JS]\n${js}\nPregunta: ${userText}`;

    try {
      const response = await aiSession.prompt(promptConContexto);
      
      const convId = currentConversation?.id || activeId;
      if (convId) {
        const convToUpdate = useChatStore.getState().conversations.find((c) => c.id === convId);
        if (convToUpdate) {
          updateConversation(convId, {
            messages: [...convToUpdate.messages, { role: "assistant", text: response }]
          });
        }

        if (isNewConversation) {
          // Generate title asynchronously
          setTimeout(async () => {
            try {
              const apiTarget = detectedApiRef.current;
              if (apiTarget) {
                const titleSession = await apiTarget.create({ systemPrompt: "Eres un resumidor. Devuelve un titulo de maximo 4 palabras sobre el tema principal." });
                const title = await titleSession.prompt(`Resume esto en un titulo corto: ${userText}`);
                updateConversation(convId, { title: title.replace(/['"]/g, '').trim() });
                if (typeof titleSession.destroy === "function") titleSession.destroy();
              }
            } catch (e) {
              updateConversation(convId, { title: userText.slice(0, 30) + "..." });
            }
          }, 500);
        }
      }
    } catch (error) {
      const convId = currentConversation?.id || activeId;
      if (convId) {
        const convToUpdate = useChatStore.getState().conversations.find((c) => c.id === convId);
        if (convToUpdate) {
          updateConversation(convId, {
            messages: [...convToUpdate.messages, { role: "assistant", text: "Error procesando el código localmente." }]
          });
        }
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeId);
  const messages = activeConversation?.messages || [];

  return {
    status,
    messages,
    inputValue,
    setInputValue,
    isGenerating,
    isAiOpen,
    handleDownload,
    handleSendMessage
  };
}
