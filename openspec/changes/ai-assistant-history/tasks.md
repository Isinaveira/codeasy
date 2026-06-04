# Implementation Tasks: AiAssistant Conversation History

## Context
- Change: `ai-assistant-history`
- Focus: Persisted chat history, sidebar component, mode separation, new chat functionality.

## Task Breakdown

### Phase 1: State Management (Zustand & Persistence)
1. **Create `src/store/useChatStore.ts`**
   - Implement a Zustand store using the `persist` middleware.
   - Types: `Conversation` (id, title, mode, messages, createdAt, updatedAt).
   - Actions: `addConversation`, `updateConversation`, `deleteConversation`, `setActiveConversation`, `clearActiveConversation` (for new chat).
   - State: `conversations` (array), `activeId` (string | null).
2. **Refactor `useAiAssistant.ts` to use `useChatStore`**
   - Remove local `messagesByMode` state.
   - Select `activeId` and `conversations` from `useChatStore`.
   - When sending a message:
     - If no `activeId`, create a new conversation with a temporary title.
     - If `activeId`, update the existing conversation's messages.
   - Implement Title Generation logic (async function that asks AI to summarize the first prompt into a title, then updates the conversation in the store).

### Phase 2: UI Components & Integration
3. **Create `src/components/AiAssistantPanel/ConversationSidebar.tsx`**
   - Accept the current mode (`web` vs `algorithms`) from `useCodeStore`.
   - Filter `conversations` by mode.
   - Display a list of past chats.
   - Include a "New Chat" button at the top that calls `clearActiveConversation()` and clears `inputValue`.
   - Clicking a chat sets it as active and discards draft input.
4. **Update `src/components/AiAssistantPanel/AiAssistantPanel.tsx`**
   - Adjust the layout (e.g., flex-row) to show the `ConversationSidebar` on the left (or as a collapsible drawer) and the `ChatInterface` on the right.
5. **Update `src/components/AiAssistantPanel/ChatInterface.tsx`**
   - Ensure the UI reflects the active conversation messages.
   - Handle empty states (when starting a "New Chat" with no messages yet).

### Phase 3: Verification
6. **Tests & Clean up**
   - Verify Vitest tests for the hook pass with the new mock store.
   - Ensure UI layout doesn't break in different modes.

## Review Workload Forecast
- **Estimated changed lines:** ~250
- **Chained PRs recommended:** No
- **400-line budget risk:** Low
- **Decision needed before apply:** No