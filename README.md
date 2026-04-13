# School Manager

> Mobile app for managing public schools and their classes — built as a technical challenge with React Native + Expo.

![Expo](https://img.shields.io/badge/Expo-54-000020?logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Jest](https://img.shields.io/badge/Tests-Jest%20%2B%20RNTL-C21325?logo=jest&logoColor=white)

---

## Overview

School Manager centralizes school and class registration, replacing manual spreadsheet control. Users can create, edit, and delete schools and their associated classes, with instant feedback and offline-ready mock data via MirageJS.

---

## Screenshots

| Schools List | School Detail | Form (BottomSheet) | Empty State |
|:---:|:---:|:---:|:---:|
| ![Schools List](assets/screenshots/schools-list.png) | ![School Detail](assets/screenshots/school-detail.png) | ![Form](assets/screenshots/school-form.png) | ![Empty State](assets/screenshots/empty-state.png) |

> To add screenshots: run the app (`npx expo start`), capture the screens and place the `.png` files in `assets/screenshots/`.

---

## Stack

| Technology | Version | Role |
|---|---|---|
| Expo | ~54.0 | Build toolchain and SDK |
| React Native | 0.81 | Mobile framework |
| React | 19 | UI runtime |
| TypeScript | ~5.9 | Strict typing |
| Expo Router | ~6.0 | File-based navigation |
| Gluestack UI | ^1.1.73 | Component library |
| MirageJS | ^0.1.48 | In-memory mock API |
| Jest + RNTL | 29 + 13 | Testing |
| Context API | — | Global state management |

---

## Features

- **Schools** — list, create, edit, and delete schools
- **Classes** — list, create, edit, and delete classes per school
- **Shift badges** — visual indicator for morning / afternoon / evening
- **Bottom Sheet forms** — create and edit without leaving the current screen
- **Delete confirmation** — ConfirmDialog before any destructive action
- **Loading & error states** — spinner, error message with retry on every screen
- **Empty state** — friendly call-to-action when no data exists
- **Toast feedback** — action result notification after every mutation
- **Mock API** — MirageJS intercepts all fetch calls in `__DEV__` mode with seeded data

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Expo Go app on your device (or Android/iOS simulator)

### Install

```bash
npm install
```

### Run

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.

### Test

```bash
npm test
```

---

## Architecture

Feature-based folder structure. Screens are thin — all logic lives in hooks.

```
app/
  _layout.tsx          ← Stack navigator root + providers
  index.tsx            ← redirect to /schools
  schools/
    index.tsx          ← school list screen
    [id].tsx           ← school detail + class list screen

src/
  components/          ← shared: EmptyState, ConfirmDialog
  features/
    schools/
      components/      ← SchoolCard, SchoolForm, SchoolList, ShiftBadge
      hooks/           ← useSchools (fetch), useSchoolActions (mutations + toast)
      context/         ← SchoolsContext
      types.ts
    classes/
      components/      ← ClassCard, ClassForm, ClassList
      hooks/           ← useClasses, useClassActions
      context/         ← ClassesContext
      types.ts
  mocks/
    server.ts          ← MirageJS routes + seed data
  services/
    api.ts             ← fetch wrapper (get / post / put / delete)
  test-utils/
    index.tsx          ← customRender + AllProviders
```

### Key patterns

| Pattern | Where |
|---|---|
| Context stores raw data, no API calls | `*Context.tsx` |
| Hooks own fetching and state sync | `useSchools`, `useClasses` |
| Hooks own mutations + toast | `useSchoolActions`, `useClassActions` |
| Screens own local UI state only | `app/schools/*.tsx` |
| Delete always goes through `ConfirmDialog` | `ConfirmDialog.tsx` |

---

## Mock API

MirageJS is initialized in `app/_layout.tsx` only when `__DEV__ === true`.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/schools` | List all schools (with classCount + shifts) |
| POST | `/schools` | Create school |
| PUT | `/schools/:id` | Update school |
| DELETE | `/schools/:id` | Delete school |
| GET | `/classes?schoolId=:id` | List classes for a school |
| POST | `/classes` | Create class |
| PUT | `/classes/:id` | Update class |
| DELETE | `/classes/:id` | Delete class |

Seeded with 3 schools and 7 classes on first load.
