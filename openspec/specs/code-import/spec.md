# Code Import Specification

## Purpose

Parse code blocks from AI assistant markdown responses and import them into the editor panels with a controlled diff+confirm two-click flow.

## Requirements

### Requirement: Code Block Parsing

The system MUST parse ` ```html`, ` ```css`, ` ```js`, and ` ```javascript` fenced code blocks from assistant markdown messages into `{language, code}[]` structures.

#### Scenario: Parse single code block

- GIVEN an assistant message containing ` ```html\n<div>Hello</div>\n``` `
- WHEN the system renders the message
- THEN it extracts `{language: "html", code: "<div>Hello</div>"}`

#### Scenario: Parse multiple code blocks with different languages

- GIVEN an assistant message with ` ```html`, ` ```css`, and ` ```js` blocks
- WHEN the system renders the message
- THEN it extracts three separate entries with the correct languages

#### Scenario: No code blocks in message

- GIVEN an assistant message with no fenced code blocks
- WHEN the system renders it
- THEN it returns an empty array and shows no import buttons

#### Scenario: Empty code block

- GIVEN an assistant message with ` ```js\n\n``` `
- WHEN the system renders it
- THEN it extracts `{language: "js", code: ""}`

### Requirement: Import Button Overlay

Each parsed code block MUST display an "Import" button overlaid on the top-right corner, styled consistently with the existing copy button.

#### Scenario: Import button visible on code block

- GIVEN a rendered code block from a parsed assistant message
- WHEN the block language is html, css, or js
- THEN an "Import" button appears in the top-right corner

#### Scenario: No import button for unsupported language

- GIVEN a rendered code block with language `python`
- WHEN the block renders
- THEN no import button appears

### Requirement: Diff Modal

Clicking the Import button MUST open a modal showing a diff view between the current editor content and the suggested code, with labels identifying each side.

#### Scenario: Open diff modal on import click

- GIVEN a code block with suggested code `<div>New</div>` and current editor containing `<div>Old</div>`
- WHEN the user clicks "Import"
- THEN a modal opens with the current code on the left and the suggested code on the right

#### Scenario: Ctrl+Z notice in modal

- GIVEN the diff modal is open
- THEN the modal SHALL display a notice that Ctrl+Z can undo the import

### Requirement: Accept Changes

The modal MUST have an "Accept changes" button. Clicking it MUST replace the corresponding editor content with the suggested code.

#### Scenario: Accept replaces editor content

- GIVEN the diff modal is open with suggested html code
- WHEN the user clicks "Accept changes"
- THEN the HTML editor content is replaced with the suggested code

#### Scenario: Algorithms mode targets JS editor

- GIVEN the algorithms mode is active
- AND the diff modal is open for a js code block
- WHEN the user clicks "Accept changes"
- THEN the algorithms JS editor content is replaced

### Requirement: Success Toast

After accepting changes, the system MUST show a success toast notification for 3-4 seconds.

#### Scenario: Toast appears after import

- GIVEN the user has accepted changes in the diff modal
- THEN a toast notification appears with "Code imported successfully" for 3-4 seconds
