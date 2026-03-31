# FlowPay

FlowPay is a schema-driven onboarding workflow platform that enables teams to design, manage, and deploy dynamic multi-step forms with conditional logic and AI-assisted schema generation.
## Overview

FlowPay helps teams create dynamic onboarding and workflow forms without building each flow from scratch. The product is focused on a modern builder experience: schema-driven rendering, visual editing, conditional logic, multi-step forms, and a lightweight backend for publishing and collecting responses.

This project is being built as a frontend-first product with React and TypeScript, while keeping the backend simple and practical.

## Core Idea

- Create merchant onboarding and workflow forms from a visual builder
- Support dynamic field visibility with `showIf` logic
- Organize forms into multiple steps or sections
- Preview forms while building
- Publish forms and collect responses
- Add AI-assisted schema generation after the core builder is stable

## Tech Stack

| Layer | Tech |
| --- | --- |
| Frontend | React + TypeScript + Vite |
| Routing | React Router |
| Styling | Tailwind CSS |
| UI | Radix UI |
| Icons | Lucide React |
| State | Zustand |
| Server State | TanStack React Query |
| Forms | React Hook Form + Zod |
| Drag and Drop | dnd-kit |
| Backend | Node + Express + TypeScript |
| Database | MongoDB |
| Auth | Simple JWT |
| AI | Fake AI first, optional OpenAI integration later |
| Testing | Vitest + React Testing Library |

## Planned Features

### Builder

- Visual form builder
- Field settings panel
- Drag and drop reordering
- Duplicate and delete fields
- Section and multi-step support
- Live preview

### Form Engine

- Schema-driven renderer
- Validation support
- `showIf` conditional logic
- Public form fill flow

### Platform

- Builder authentication
- Save draft and publish flow
- Public shareable form links
- Response collection
- Response dashboard

### AI

- Prompt-to-form schema generation
- AI-assisted starting point for onboarding workflows

## Build Plan

### Phase 1

- Define schema
- Build renderer
- Build visual builder
- Add live preview
- Save locally with `localStorage`

### Phase 2

- Add `showIf` logic
- Add multi-step flows
- Improve builder UX
- Add schema validation

### Phase 3

- Add backend and database
- Add authentication
- Add publish and response flows
- Add AI integration
- Final polish and testing

## Project Status

Initial planning and setup.

## Why FlowPay

This project is designed to showcase:

- React architecture
- TypeScript usage
- schema-driven UI design
- form rendering and validation
- advanced state management
- product thinking and frontend polish

## Future Scope

- Template library
- Analytics dashboard
- Theme customization
- JSON import and export
- Version history
- Embedded forms
