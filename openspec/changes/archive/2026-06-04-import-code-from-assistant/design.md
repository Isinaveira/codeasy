# Design: Import Code from AI Assistant

## Technical Approach

Parse fenced code blocks from assistant markdown responses, render an Import button overlay on each block, and wire a two-click flow: modal with diff view → accept → replace editor content. Leverage `marked`'s existing `renderer` extension to intercept code blocks without touching the markdown pipeline.

## Architecture Decisions

| Decision | Choice | Alternatives | Rationale |
|----------|--------|-------------|-----------|
| Code block interception | `marked.Renderer` `code` override | Post-processing regex on HTML | Marked renderer runs at render time; no double-parsing, no DOM manipulation |
| Diff view | `diff` package for unified diff text | React-diff-viewer, inline strings | Minimal dep (2KB); show unified diff in a styled `<pre>` — no heavy component library |
| Toast notifications | Inline `useToast` hook (custom) | sonner, react-hot-toast | Only one toast type needed; avoid adding a dep for 15 lines of code |
| Store integration | Direct `useCodeStore` setters | New store, prop drilling | `setHtml`/`setCss`/`setJs` already exist and handle localStorage+devMode routing |
| Import button position | Top-right overlay on code block | Below block, inline | Consistent with copy-button pattern seen in most chat UIs |

## Data Flow

```ascii
Assistant message (markdown)
       │
       ▼
  marked.parse() with custom renderer
       │
       ├── code block detected? ──→ CodeBlock component (with Import btn)
       │                                │
       │                          user clicks Import
       │                                │
       │                                ▼
       │                         ImportDiffModal opens
       │                          (reads current editor content)
       │                                │
       │                          user clicks "Accept changes"
       │                                │
       │                                ▼
       │                         useCodeStore.setHtml/Css/Js()
       │                                │
       │                                ▼
       │                         Toast: "Código importado"
       │
       └── no code block? ──→ rendered as plain markdown (current behavior)
```

## File Changes

| File | Action | Description |
|------|--------|-------------|
| `src/utils/parseCodeBlocks.ts` | Create | Utility to extract `{language, code}[]` from markdown text using regex |
| `src/components/AiAssistantPanel/CodeBlock.tsx` | Create | Code block wrapper with Import button overlay |
| `src/components/AiAssistantPanel/ImportDiffModal.tsx` | Create | Modal with diff view + Accept changes button + Ctrl+Z notice |
| `src/hooks/useToast.ts` | Create | Simple toast state hook |
| `src/components/AiAssistantPanel/ChatInterface.tsx` | Modify | Wire custom `marked` renderer to use `CodeBlock` component |
| `src/components/AiAssistantPanel/AiAssistantPanel.tsx` | Modify | Manage diff modal state, pass current devMode down |
| `package.json` | Modify | Add `diff` dependency |

## Interfaces / Contracts

```typescript
// src/utils/parseCodeBlocks.ts
interface ParsedCodeBlock {
  language: string;   // "html" | "css" | "js" | "javascript"
  code: string;
  index: number;
}

function parseCodeBlocks(markdown: string): ParsedCodeBlock[]

// src/hooks/useToast.ts
interface ToastState {
  message: string;
  visible: boolean;
}
function useToast(): {
  toast: string | null;
  showToast: (message: string, duration?: number) => void;
  dismissToast: () => void;
}
```

## Testing Strategy

| Layer | What to Test | Approach |
|-------|-------------|----------|
| Unit | `parseCodeBlocks` | Test each language, empty input, multiple blocks, unsupported languages |
| Unit | `CodeBlock` | Render import button, click handler |
| Unit | `ImportDiffModal` | Open/close, accept triggers callback, Ctrl+Z notice visible |
| Integration | Full import flow | Render ChatInterface with mock message → click Import → verify modal → click Accept → verify store updated |

## Migration / Rollout

No migration required. New feature — old messages without code blocks are unaffected.

## Open Questions

- [ ] None
