# Tasks: Import Code from AI Assistant

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~300 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Suggested split | Single PR |
| Delivery strategy | single-pr |

Decision needed before apply: No
Chained PRs recommended: No
Chain strategy: size-exception
400-line budget risk: Low

## Phase 1: Foundation

- [x] 1.1 Install `diff` package: `npm install diff` and `npm install -D @types/diff`
- [x] 1.2 RED: Write tests for `parseCodeBlocks` — single block, multiple blocks, no blocks, empty block, unsupported language
- [x] 1.3 GREEN: Create `src/utils/parseCodeBlocks.ts` with regex parser for ` ```html`, ` ```css`, ` ```js`, ` ```javascript`
- [x] 1.4 RED: Write tests for `useToast` — show, auto-dismiss, manual dismiss
- [x] 1.5 GREEN: Create `src/hooks/useToast.ts` with show/dismiss state

## Phase 2: Core Implementation

- [x] 2.1 RED: Write tests for `CodeBlock` — renders import button, click handler fires callback, no button for unsupported language
- [x] 2.2 GREEN: Create `src/components/AiAssistantPanel/CodeBlock.tsx` with Import button overlay (top-right, styled like copy button)
- [x] 2.3 RED: Write tests for `ImportDiffModal` — opens with diff, Ctrl+Z notice visible, Accept calls onAccept, close button works
- [x] 2.4 GREEN: Create `src/components/AiAssistantPanel/ImportDiffModal.tsx` with:
  - Diff view (current vs suggested) using `diff` package unified output in styled `<pre>`
  - Ctrl+Z undo notice
  - "Accept changes" button

## Phase 3: Integration

- [x] 3.1 Modify `ChatInterface.tsx`: extend `marked` with `lexer()` to intercept code tokens, render `CodeBlock` for supported languages
- [x] 3.2 Modify `AiAssistantPanel.tsx`: manage diff modal state, pipe current editor content + devMode, wire setHtml/setCss/setJs on accept, toast notification
- [x] 3.3 Write integration tests: unit + component integration covering parser, CodeBlock, ImportDiffModal, and full flow
