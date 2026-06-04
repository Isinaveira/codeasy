# Chat History Sidebar Specification

## Purpose

Provides a user interface to view, select, and start conversations within the AI Assistant Panel.

## Requirements

### Requirement: Sidebar Display

The system MUST display a list of past conversations in a sidebar.

#### Scenario: User opens AI Assistant

- GIVEN the AI Assistant Panel is open
- WHEN the user views the interface
- THEN a collapsible or integrated sidebar MUST be visible
- AND it MUST list past conversations for the active mode

### Requirement: Conversation Selection

The system MUST allow users to switch between past conversations.

#### Scenario: User clicks a past conversation

- GIVEN the sidebar lists past conversations
- WHEN the user clicks on a specific conversation
- THEN the current chat view MUST be replaced with the selected conversation
- AND any active draft message MUST be discarded

### Requirement: New Chat Button

The system MUST provide a "New Chat" button to start a fresh conversation context.

#### Scenario: User clicks New Chat

- GIVEN the AI Assistant Panel is open
- WHEN the user clicks the "New Chat" button
- THEN the current chat view MUST be cleared
- AND a fresh conversation context MUST be started
- AND any active draft message MUST be discarded
