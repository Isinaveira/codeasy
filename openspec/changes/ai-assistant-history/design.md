# Design: AiAssistant Conversation History

## Technical Approach

Extract conversation state from local React state in `useAiAssistant` into a dedicated Zustand store (`useChatStore`) using the `persist` middleware for `localStorage`. Update the UI to render a new `ConversationSidebar` within the `AiAssistantPanel`. `useAiAssistant` will handle the AI API interactions and delegate message updates and background title generation to the store.

## Architecture Decisions

### Decision: State Management Separation

**Choice**: Create a separate `useChatStore` Zustand store with `persist`.
**Alternatives considered**: Add conversation history directly to the existing `useCodeStore`.
**Rationale**: Chat persistence is a separate domain with potentially large data footprints. Isolating it prevents polluting the editor's core state and makes localStorage management modular and safe.

### Decision: Active Conversation Tracking

**Choice**: Track `activeConversationId` mapped by `DevMode` (e.g., `{ web: string | null, algorithms: string | null }`).
**Alternatives considered**: A single global `activeConversationId`.
**Rationale**: The spec requires mode isolation. Tracking active chats per mode ensures that when a user switches from `web` to `algorithms`, their specific ongoing chat context is seamlessly restored.

### Decision: Title Generation Execution

**Choice**: Run an asynchronous background prompt immediately after the first user message to generate the title.
**Alternatives considered**: Modifying the system prompt to force the AI to return JSON (e.g., `{ title, message }`).
**Rationale**: The built-in Nano model can be unreliable with strict JSON schemas. Generating the title in a separate, fire-and-forget background prompt is safer. If it fails, we easily fallback to truncating the user's first prompt without interrupting the main chat response.

## Data Flow

    User Input ──→ useAiAssistant (sendMessage) ──→ AI Model
                         │                              │
                         ↓                              ↓
                  useChatStore (persist) ←── save user & AI messages
                         │
                         ├─→ On First Msg: Background Title Generation
                         │
    Sidebar ──────→ Reads history & dispatches setActiveConversation()

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/store/useChatStore.ts` | Create | Defines Zustand store, `Conversation` type, and actions for CRUD operations on chats. |
| `src/hooks/useAiAssistant.ts` | Modify | Removes local `messagesByMode` state; delegates to `useChatStore`. Adds logic to trigger title generation for new chats. |
| `src/components/AiAssistantPanel/AiAssistantPanel.tsx` | Modify | Wraps `ChatInterface` and the new `ConversationSidebar` in a flex container layout. |
| `src/components/AiAssistantPanel/ConversationSidebar.tsx` | Create | Renders history list filtered by active mode, with a "New Chat" button to reset the active ID. |

## Interfaces / Contracts

```typescript
export interface Conversation {
  id: string;
  mode: DevMode;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  conversations: Conversation[];
  activeIds: Record<DevMode, string | null>;
  addMessage: (mode: DevMode, message: Message) => void;
  setActiveId: (mode: DevMode, id: string | null) => void;
  updateTitle: (id: string, title: string) => void;
  deleteConversation: (id: string) => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `useChatStore` | Verify `persist` saves properly, `activeIds` are updated, and mode filtering works correctly. |
| Integration | `useAiAssistant` | Mock AI Model, verify title generation background task triggers on the first message and fallbacks correctly. |
| UI/E2E | Sidebar Selection | Verify clicking a history item changes the view and clears the current draft. Verify "New Chat" resets context. |

## Migration / Rollout

No migration required. Existing sessions will start with an empty history, behaving like a fresh install.

## Open Questions

- [ ] Does the built-in Chrome AI limit parallel sessions if we run the title generation concurrently with the main response generation? If so, we may need to queue the title generation to run after the main response completes.