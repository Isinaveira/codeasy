import { useEffect, useRef, type FormEvent } from "react";
import type { Message } from "../../hooks/useAiAssistant";

interface MessageListProps {
  messages: Message[];
  isGenerating: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
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
}

export function MessageList({ messages, isGenerating, messagesEndRef }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex flex-col max-w-[85%] rounded-lg p-3 text-xs leading-relaxed shadow-xs
            ${msg.role === "user"
              ? "ml-auto bg-brand text-white"
              : "mr-auto bg-canvas border border-line text-main"
            }`}
        >
          <span
            className={`text-[10px] font-bold uppercase tracking-wider mb-1 opacity-60
              ${msg.role === "user" ? "text-white" : "text-brand"}`}
          >
            {msg.role === "user" ? "Tú" : "Gemini Nano"}
          </span>
          <p className="whitespace-pre-wrap">{msg.text}</p>
        </div>
      ))}

      {/* Animación de respuesta */}
      {isGenerating && (
        <div className="mr-auto bg-canvas border border-line text-dim rounded-lg p-3 text-xs animate-pulse flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-brand rounded-full animate-bounce" />
          <span>Pensando...</span>
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
  isGenerating
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
