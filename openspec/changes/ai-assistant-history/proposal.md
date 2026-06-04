# Proposal: AiAssistant Conversation History

## Intent

The current AI Assistant loses context if the page is refreshed and does not allow users to revisit previous conversations. This feature adds a Conversation History (Sidebar) to the AiAssistantPanel, letting users persist and switch between past chats, separated by development mode (Web vs Algorithms).

## Scope

### In Scope
- A collapsible or integrated sidebar within the AiAssistantPanel to list past conversations.
- A "New Chat" button to start a fresh conversation context.
- Persisting conversations in `localStorage` via Zustand persist middleware.
- Isolating conversation history by active mode (`web` vs `algorithms`).
- Generating a short title/summary for each conversation based on the user's first prompt.
- Clicking a conversation in the history replaces the current chat view and discards any active draft.

### Out of Scope
- Syncing conversations across devices (cloud storage).
- Editing or deleting individual messages inside a past conversation.
- Renaming the generated conversation title manually.

## Capabilities

### New Capabilities
- `chat-history-sidebar`: Displays a list of past conversations and allows switching between them.
- `chat-persistence`: Persists conversations to `localStorage` and loads them based on the active mode.

### Modified Capabilities
- None

## Approach

1. **State Management**: Refactor `useAiAssistant` or create a new Zustand store (e.g., `useChatStore`) using `persist` middleware to save conversations. The store will hold a list of `Conversation` objects, each containing an ID, title, mode, and messages.
2. **Title Generation**: Update the `systemPrompt` in `useAiAssistant` to return a concise title alongside the answer for the first prompt, or append an instruction for the AI to handle title generation implicitly. Alternatively, use a separate fast prompt to generate the title.
3. **UI Components**:
   - Create a `ConversationSidebar` component to list chats.
   - Update `AiAssistantPanel` to display the sidebar alongside the `ChatInterface`.
   - Update `ChatInterface` to reflect the active conversation.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/hooks/useAiAssistant.ts` | Modified | Needs to support active conversation context, title generation, and delegate state to Zustand. |
| `src/store/useChatStore.ts` | New | New Zustand store for persisting conversation history. |
| `src/components/AiAssistantPanel/AiAssistantPanel.tsx` | Modified | Include the new Sidebar component in the layout. |
| `src/components/AiAssistantPanel/ConversationSidebar.tsx` | New | Component to display and select past chats. |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| LocalStorage limits exceeded | Low | Conversations are text-only; we can implement a hard limit on the number of stored conversations if needed. |
| AI title generation fails or is too slow | Medium | Fallback to a truncated version of the user's first prompt if generation fails or times out. |

## Rollback Plan

If the feature causes issues, we will revert the Zustand store additions and restore `useAiAssistant.ts` and `AiAssistantPanel.tsx` to their previous state, effectively disabling persistence and the sidebar.

## Dependencies

- Zustand (already installed, need `persist` middleware which is built-in).

## Success Criteria

- [ ] Conversations are saved across page reloads.
- [ ] Users can see a list of past chats grouped by mode.
- [ ] Clicking a past chat loads it successfully and discards any draft message.
- [ ] Users can click a "New Chat" button to clear the current view and start a fresh conversation.
- [ ] The first message generates a relevant short title for the conversation.