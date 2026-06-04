import { useEffect, useRef, type FormEvent } from "react";
import type { Message } from "../../hooks/useAiAssistant";
import { marked } from "marked";
import CodeBlock from "./CodeBlock";

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onImportCode: (code: string, language: string) => void;
}

interface MessageFormProps {
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isGenerating: boolean;
}

interface ChatInterfaceProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isGenerating: boolean;
  onImportCode: (code: string, language: string) => void;
}

function renderAssistantMessage(text: string, onImportCode: (code: string, language: string) => void) {
  const tokens = marked.lexer(text);
  const SUPPORTED = new Set(["html", "css", "js", "javascript"]);

  return tokens.map((token, i) => {
    if (token.type === "code" && token.lang && SUPPORTED.has(token.lang)) {
      return (
        <CodeBlock
          key={i}
          language={token.lang}
          code={token.text}
          onImport={() => onImportCode(token.text, token.lang!)}
        />
      );
    }

    return (
      <div
        key={i}
        className="markdown-content text-xs w-full overflow-hidden"
        dangerouslySetInnerHTML={{ __html: marked.parse(token.raw) as string }}
      />
    );
  });
}

export function MessageList({ messages, isGenerating, messagesEndRef, onImportCode }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex flex-col max-w-[85%] p-3.5 text-xs leading-relaxed shadow-sm transition-all duration-200
            ${msg.role === "user"
              ? "ml-auto bg-gradient-to-tr from-brand to-brand-hover text-white border border-brand/20 rounded-2xl rounded-tr-2xs shadow-brand/5"
              : "mr-auto bg-surface/60 dark:bg-surface/45 backdrop-blur-md border border-line/65 text-main rounded-2xl rounded-tl-2xs"
            }`}
        >
          <span
            className={`text-[9px] font-bold uppercase tracking-widest mb-1
              ${msg.role === "user" ? "text-white/80" : "text-brand"}`}
          >
            {msg.role === "user" ? "Tú" : "Gemini Nano"}
          </span>
          {msg.role === "user" ? (
            <p className="whitespace-pre-wrap font-medium tracking-tight">{msg.text}</p>
          ) : (
            renderAssistantMessage(msg.text, onImportCode)
          )}
        </div>
      ))}

      {/* Animación de respuesta */}
      {isGenerating && (
        <div className="mr-auto bg-surface/60 dark:bg-surface/45 backdrop-blur-md border border-line/65 text-dim rounded-2xl rounded-tl-2xs p-3 text-xs animate-pulse flex items-center gap-2.5 shadow-2xs">
          <div className="flex items-center gap-1 shrink-0">
            <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" />
          </div>
          <span className="scale-90 opacity-70 font-semibold uppercase tracking-wider text-[9px]">Analizando código...</span>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export function MessageForm({ inputValue, onInputChange, onSubmit, isGenerating }: MessageFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-3 border-t border-line bg-canvas flex gap-2 items-center"
    >
      <input
        type="text"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        disabled={isGenerating}
        placeholder="Pregunta algo sobre tu código..."
        className="flex-1 bg-surface border border-line rounded-lg px-3 py-2 text-xs text-main focus:outline-none focus:border-brand disabled:opacity-50 transition-colors"
      />
      <button
        type="submit"
        disabled={isGenerating || !inputValue.trim()}
        className="bg-brand text-white px-3 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Enviar
      </button>
    </form>
  );
}

export default function ChatInterface({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  isGenerating,
  onImportCode
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll al final cuando llegan nuevos mensajes o cambia el estado de generación
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isGenerating]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-surface">
      <MessageList
        messages={messages}
        isGenerating={isGenerating}
        messagesEndRef={messagesEndRef}
        onImportCode={onImportCode}
      />
      <MessageForm
        inputValue={inputValue}
        onInputChange={onInputChange}
        onSubmit={onSubmit}
        isGenerating={isGenerating}
      />
    </div>
  );
}
