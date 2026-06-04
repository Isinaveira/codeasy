import { Plus, MessageSquare } from "lucide-react";
import { useCodeStore } from "../../store/useCodeStore";
import { useChatStore } from "../../store/useChatStore";

export default function ConversationSidebar() {
  const { devMode } = useCodeStore();
  const { conversations, activeId, setActiveConversation, clearActiveConversation } = useChatStore();

  const modeConversations = conversations.filter((c) => c.mode === devMode);

  return (
    <aside className="w-64 h-full bg-surface border-r border-line flex flex-col transition-all duration-300 shrink-0">
      <div className="p-2.5 pr-3 pl-14 border-b border-line">
        <button
          onClick={() => clearActiveConversation()}
          className="w-full h-9 flex items-center justify-center gap-2 px-3 bg-brand text-white rounded font-medium hover:bg-brand/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo Chat
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {modeConversations.length === 0 ? (
          <div className="text-sm text-text/50 text-center mt-4">
            No hay chats recientes
          </div>
        ) : (
          modeConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv.id)}
              className={`w-full flex items-center gap-2 p-2 text-left text-sm rounded transition-colors ${
                activeId === conv.id
                  ? "bg-brand/10 text-brand font-medium"
                  : "text-text hover:bg-line/50"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span className="truncate">{conv.title}</span>
            </button>
          ))
        )}
      </div>
    </aside>
  );
}
