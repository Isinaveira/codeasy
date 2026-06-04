# Chat Persistence Specification

## Purpose

Handles saving, loading, and organizing AI Assistant conversations across sessions and modes.

## Requirements

### Requirement: Local Storage Persistence

The system MUST persist conversations across page reloads.

#### Scenario: Page reload

- GIVEN the user has an active or past conversation
- WHEN the user refreshes the page
- THEN the conversation history MUST be restored from `localStorage`

### Requirement: Mode Isolation

The system MUST isolate conversation history by active mode (`web` vs `algorithms`).

#### Scenario: User switches modes

- GIVEN the user has conversations in both `web` and `algorithms` modes
- WHEN the user switches the active mode
- THEN the system MUST only load and display conversations for the currently active mode

### Requirement: Title Generation

The system MUST generate a short title for each conversation based on the user's first prompt.

#### Scenario: First prompt of a new conversation

- GIVEN the user starts a new conversation
- WHEN the user sends their first message
- THEN the system MUST generate a concise title for the conversation
- AND the title MUST be saved with the conversation data

#### Scenario: Title generation fails

- GIVEN the user sends their first message
- WHEN the AI fails to generate a title or times out
- THEN the system SHOULD fallback to a truncated version of the user's first prompt
