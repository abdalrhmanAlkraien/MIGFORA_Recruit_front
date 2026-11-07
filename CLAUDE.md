# MIGFORA Studio — CLAUDE.md
> Read this before every task. This is the single source of truth for this project.
> It describes the code as it exists, the agreed conventions, and the known gaps.

---

## Project Identity

**Product:** MIGFORA Studio — AI-assisted production workspace for films, series and short stories
**Base:** MIGFORA Skeleton (reusable React skeleton for all MIGFORA projects)
**Owner:** MIGFORA — AWS Partner, Cloud & Technology Solutions (GCC/MENA market)
**Stack:** Vite + React JS + React Router v6 + Axios + Zustand + react-i18next + Recharts
**Styling:** Plain CSS (no Tailwind, no Bootstrap, no CSS-in-JS)
**Language:** JavaScript only — never suggest or use TypeScript
**UI language:** English only — controlled by `appConfig.features.multiLanguage = false` (language code is kept, not deleted)

---

## Before Every Task

1. Read this file fully before writing any code
2. Check **Common Components** — reuse before creating anything new
3. Identify which files need to be created or modified
4. Follow the folder structure exactly — do not invent new patterns
5. Use the relevant checklist below
6. Check **Known Gaps** — don't copy a legacy pattern into new code

New common components are added only when a real page needs one that doesn't exist.

---

## Folder Structure

```
index.html                       ← Google Fonts: Syne 600/700/800, DM Sans 300/400/500
.env                             ← VITE_API_BASE_URL, VITE_MULTI_LANGUAGE, VITE_DEFAULT_LANG
src/
├── main.jsx                     ← imports i18n, useLanguageStore (init), index.css; renders <App/>
├── App.jsx                      ← renders <AppRoutes/>
├── index.css                    ← design tokens (light + dark), reset
├── api/
│   ├── axiosInstance.js
│   ├── auth.js
│   └── profile.js
├── components/
│   ├── common/                  ← shared UI (see Common Components)
│   │   ├── *.jsx                ← one component per file
│   │   ├── index.js             ← barrel export (NotFound is not exported)
│   │   └── styles/              ← one CSS file per component
│   ├── profile/                 ← ProfileDrawer, SidebarProfile
│   ├── styles/                  ← Navbar.css, Sidebar.css, Footer.css (+ legacy SubNavbar.css)
│   ├── Footer.jsx               ← exists, not mounted
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── SubNavbar.jsx            ← LEGACY — do not import (pending deletion)
├── config/
│   └── appConfig.js
├── hooks/
│   ├── useAutoGrow.js           ← textarea auto-height
│   ├── useEscape.js             ← escape stack registration
│   └── useScrollLock.js         ← nested-safe body scroll lock
├── i18n/
│   ├── index.js
│   └── locales/ (en.json, ar.json)
├── layouts/
│   ├── AppLayout.jsx
│   ├── AuthLayout.jsx
│   └── styles/
├── pages/
│   ├── styles/
│   ├── ComponentsPreview.jsx    ← /preview — living showcase of every common component
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Profile.jsx
│   └── Register.jsx
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── store/
│   ├── authStore.js
│   ├── useLanguageStore.js
│   ├── useThemeStore.js
│   └── useToastStore.js
└── utils/
    ├── date.js                  ← toDate, formatRelative, formatDateTime, formatDate
    ├── duration.js              ← parseDuration, formatDuration (seconds)
    ├── escapeStack.js           ← single Escape handler for stacked overlays
    └── file.js                  ← formatBytes, matchesAccept, getFileKind
```

Page-specific components go in `src/components/<pageName>/` with their own `styles/` folder.

---

## Code Style Rules

### General
- JavaScript only — never TypeScript, never type annotations
- Functional components only
- Default exports for components, pages, stores and hooks; named exports for API functions and utils
- `const` always — no `var`, `let` only when reassigned
- Regular `function` keyword for components, arrow functions for callbacks
- No `console.log` in committed code
- **All user-facing text through `t()`** — no hardcoded UI strings or aria-labels
- Every component file starts with a JSDoc block listing its props

### Import Order
```js
// 1. React
import { useState, useEffect } from 'react'
// 2. React Router
import { useNavigate } from 'react-router-dom'
// 3. Third-party (react-i18next, recharts, react-dom…)
import { useTranslation } from 'react-i18next'
// 4. Stores
import useAuthStore from '../store/authStore'
// 5. Hooks
import useEscape from '../hooks/useEscape'
// 6. Config
import appConfig from '../config/appConfig'
// 7. Utils
import { formatDuration } from '../utils/duration'
// 8. API
import { getProjectsApi } from '../api/projects'
// 9. Common components
import { FormButton, DataTable } from '../components/common'
// 10. Other components
import ProjectCard from '../components/projects/ProjectCard'
// 11. CSS — always last
import './styles/Projects.css'
```

### Component Structure
```
1. Imports
2. Constants / static data (outside component — inside only if it needs t())
3. Component function
   a. Store hooks  b. Router hooks  c. i18n hook  d. Refs  e. State
   f. Derived values  g. Effects  h. Handlers  i. Return JSX
4. Export
```

### onChange convention
- `FormField` and `TextareaField` pass the **native event**
- Every other field passes the **value**: `SelectField`, `CheckboxField`, `Toggle`, `RadioCardGroup`,
  `NumberField`, `DurationField`, `TagInput`, `PromptComposer` (string)

---

## CSS Rules

- One `.css` file per `.jsx` file, same name, in the sibling `styles/` folder
- Field components additionally import `FormField.css` for the shared label / error / helper shell
- Always CSS variables — never hardcode colors, fonts or z-index values
- BEM-like naming: `.block__element--modifier`
- Layers in order: base (light) → `[data-theme="dark"]` overrides
  (write `/* ═══ DARK MODE ═══ — handled by semantic tokens */` when no override is needed)
- `prefers-reduced-motion` disables decorative animation (skeleton shimmer, indeterminate progress)

### Inline styles — allowed only for
1. Dynamic RTL values from store state (flex direction, text alignment)
2. Runtime-computed geometry (Popover / Tooltip position, `useAutoGrow` height)

Everything else is a CSS class. Column widths, sizes and tones use modifier classes.

### CSS Logical Properties (mandatory)

| ❌ Physical | ✅ Logical |
|---|---|
| `margin-left` / `margin-right` | `margin-inline-start` / `margin-inline-end` |
| `margin-top` / `margin-bottom` | `margin-block-start` / `margin-block-end` |
| `padding-left` / `padding-right` | `padding-inline-start` / `padding-inline-end` |
| `left` / `right` | `inset-inline-start` / `inset-inline-end` |
| `top` / `bottom` | `inset-block-start` / `inset-block-end` |
| `border-left` / `border-right` | `border-inline-start` / `border-inline-end` |
| `border-top` / `border-bottom` | `border-block-start` / `border-block-end` |

---

## Design Tokens (`src/index.css`)

### Brand & surfaces
| Token | Light | Dark |
|---|---|---|
| `--color-orange` / `--color-orange-2` | `#FF9900` / `#FFB347` | same |
| `--color-navy` / `-2` / `-3` | `#0D1B2A` / `#162233` / `#1E2D40` | same |
| `--color-darkest` | `#080F18` | same |
| `--color-white` / `--color-off-white` | `#FFFFFF` / `#F8F9FB` | same |
| `--bg-app` | `#F0F2F5` | `#0D1B2A` |
| `--bg-surface` / `--bg-surface-2` | `#FFFFFF` / `#F8F9FB` | `#162233` / `#1E2D40` |
| `--bg-sidebar` / `--bg-navbar` | `#FFFFFF` | `#111C29` |
| `--border-color` / `--border-color-2` | navy 0.08 / 0.14 | white 0.07 / 0.1 |
| `--text-primary` | `#0D1B2A` | `#F0F4F8` |
| `--text-secondary` / `--text-muted` | navy 0.5 / 0.35 | **orange** 0.75 / 0.5 |
| `--nav-link-hover-bg` / `--nav-link-active-bg` | navy 0.05 / orange 0.1 | white 0.06 / orange 0.12 |
| `--auth-*` | auth card / input tokens | dark equivalents |

### Semantic status colors
`--color-danger` · `--color-success` · `--color-warning` · `--color-info`
each with `-bg` and `-border` variants (e.g. `--color-danger-bg`, `--color-danger-border`).
Light: `#DC2626` / `#059669` / `#B96D00` / `#2563EB` · Dark: `#F87171` / `#34D399` / `#FF9900` / `#60A5FA`.

### Fields, focus, overlays
| Token | Purpose |
|---|---|
| `--field-bg` / `--field-bg-focus` / `--field-border` | inputs, selects, composers |
| `--focus-ring` | `0 0 0 3px rgba(255,153,0,0.12)` — all focus-visible states |
| `--overlay-bg` | drawer and modal backdrop |
| `--shadow-popover` / `--shadow-modal` | floating panels / dialogs |
| `--skeleton-base` / `--skeleton-shine` | loading placeholders |
| `--shadow-navbar` / `--shadow-sidebar` | layout chrome |

### Typography & layout
```css
--font-heading: 'Syne', Arial Black, sans-serif;
--font-body:    'DM Sans', Calibri, sans-serif;
--font-mono:    ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;   /* IDs, hashes, models */
--navbar-height: 56px;
--sidebar-width: 248px;
```

### Z-index scale (tokens only)
| Layer | Token | Value |
|---|---|---|
| Sidebar | `--z-sidebar` | 1000 |
| Navbar | `--z-navbar` | 1100 |
| Drawer overlay / panel | `--z-drawer-overlay` / `--z-drawer` | 1300 / 1301 |
| Modal | `--z-modal` | 1400 |
| ConfirmDialog | `--z-confirm` | 1500 |
| Popover (selects, menus, mentions) | `--z-popover` | 1600 |
| Tooltip | `--z-tooltip` | 1700 |
| Toast | `--z-toast` | 9999 |

---

## Language System

```js
// appConfig.js
features: {
  multiLanguage:  import.meta.env.VITE_MULTI_LANGUAGE === 'true',   // false for Studio
  defaultLang:    import.meta.env.VITE_DEFAULT_LANG || 'en',
  supportedLangs: ['en', 'ar'],
}
```
- `useLanguageStore` exposes `lang`, `isEnabled`, `setLang`, `toggleLang`; sets `<html lang/dir>` and syncs i18n
- When `multiLanguage` is false: language forced to `defaultLang`, saved `migfora_lang` ignored, setters are no-ops
- Navbar renders the language button only when `isEnabled`
- The store is initialized by importing it in `main.jsx`
- Never delete `useLanguageStore`, `ar.json` or RTL JSX branches

### Translation rules
- Every UI string → key in `en.json`; same key in `ar.json` (English placeholder is fine) — keep parity
- Namespaces: `common` `navbar` `sidebar` `footer` `confirm_dialog` `not_found` `status` `select` `prompt`
  `number` `duration` `tags` `upload` `file` `table` `copy` `time` `breadcrumbs`
- `StatusBadge` translates `status.<STATUS>` — every new status needs a key

### RTL rules (dormant but maintained)
1. Spacing/positioning → logical properties
2. Order swaps → JSX with `lang === 'ar'`
3. Mirrored icons → `--rtl` modifier class from JSX (e.g. `breadcrumbs__separator--rtl`)
4. **Never** `html[dir="rtl"]` or `[dir="rtl"]` selectors

---

## Theme System
- `useThemeStore`: `theme`, `toggleTheme()`, `setTheme()` — sets `data-theme` on `<html>`, persists `migfora_theme`, first visit follows `prefers-color-scheme`
- Components use semantic tokens; dark overrides only where tokens aren't enough

---

## Overlay System

All floating UI follows these rules:

| Need | Use |
|---|---|
| Side panel for create/edit forms, details, history | `Drawer` |
| Centered dialog for non-destructive tasks | `Modal` |
| Destructive / irreversible confirmation | `ConfirmDialog` |
| Anchored floating panel (custom) | `Popover` |
| Short hover/focus hint | `Tooltip` |
| Transient feedback | `useToastStore().addToast()` |

- Overlays render through portals to `document.body`
- **Escape**: register with `useEscape(active, handler)` — the escape stack closes only the top-most layer.
  Never add raw `keydown` Escape listeners.
- **Scroll lock**: `useScrollLock(active)` — never set `document.body.style.overflow` directly
- Clicks inside a `Popover` don't bubble to React parents (safe inside clickable rows)
- Opening a ConfirmDialog from a Drawer or Modal is supported (it renders above both)

---

## Common Components

Import from the barrel:
```js
import { FormButton, SelectField, DataTable, Modal } from '../components/common'
```
Every component is showcased on `/preview` (`ComponentsPreview.jsx`).

### Actions & feedback

#### `FormButton`
`variant` `'primary'|'secondary'|'danger'|'ghost'|'outline'` · `type` (default `'button'`) · `loading` · `loadingText` · `disabled` · `fullWidth` · `onClick`

| Variant | Use | Examples |
|---|---|---|
| `primary` | Single main CTA | Submit, Create, Generate |
| `secondary` | Significant, not main | Export, Duplicate, Run again |
| `outline` | Page-level actions | Back, Filter, Compare, Logout |
| `ghost` | Low priority, tight spaces | Cancel in footers, Clear, Skip |
| `danger` | Destructive — always with `ConfirmDialog` | Delete, Revoke, Reject |

| Location | Buttons |
|---|---|
| Page header | `primary` + `outline` |
| Drawer / Modal footer | `primary` + `ghost` |
| Table row actions | `DropdownMenu` (danger items open ConfirmDialog) |
| Confirm dialog | built in (`ghost` + `danger`/`primary`) |
| Empty state CTA | `primary` |

Rules: never two `primary` side by side · never `danger` without `ConfirmDialog` · never `ghost` as the only button on a page.

#### `DropdownMenu` — action menu
`items` `[{ key, label, icon?, onClick, danger?, disabled?, hint? } | { key, divider: true }]` · `label` (aria, default "More actions") · `placement` `'bottom-end'|'bottom-start'` · `disabled` · `children` (text trigger; default kebab icon).
Keyboard: arrows, Home/End, Escape. Danger items must open a `ConfirmDialog`.

#### `FormAlert`
`type` `'error'|'success'` · `message` (renders nothing when empty)

#### `StatusBadge`
`status` · `label` (override). Unknown → neutral.

| Variant | Statuses |
|---|---|
| success | DONE ACTIVE COMPLETED PASSED APPROVED |
| warning | SCHEDULED PENDING RUNNING UPLOADING CHANGES_REQUESTED NEEDS_REVALIDATION |
| danger | FAILED MISSED CRITICAL HIGH REJECTED |
| info | MEDIUM IN_REVIEW WAITING |
| neutral | DRAFT UNKNOWN LOW QUEUED CANCELLED SUPERSEDED RETIRED |
| locked (navy + lock icon) | LOCKED |
| role (outline, no dot) | OWNER VIEW EDIT REVIEW |
| format (orange outline, no dot) | FILM SERIES SHORT_STORIES |
| package (legacy) | BASIC GROWTH ENTERPRISE |

#### `Spinner`
`size` `'sm'|'md'|'lg'` · `color` `'orange'|'white'|'navy'` · `label`

#### `ProgressBar`
`value` · `max` (100) · `label` · `valueLabel` (e.g. "$420 / $1,000") · `showValue` · `tone` `'orange'|'success'|'warning'|'danger'|'info'` · `size` `'md'|'sm'` · `indeterminate`

#### `Skeleton`
`variant` `'text'|'circle'|'rect'` · `size` (text: sm/md/lg/full · circle: sm/md/lg · rect height: sm/md/lg/full) · `lines` (text). Set `aria-busy` on the loading region.

#### `EmptyState`
`title` · `subtitle` · `action` · `icon`

#### `ToastRenderer` + `useToastStore`
Mounted once in AppLayout. `addToast(message, 'success'|'error'|'info', durationMs = 3500)`.

### Form fields
All fields share: `label` · `name` (unique per page → id `field-${name}`) · `error` · `required` · `disabled`.
Helper text uses `.form-field__helper`.

#### `FormField` — text input (event)
`type` · `value` · `onChange(event)` · `placeholder` · `minLength` · `autoComplete`

#### `TextareaField` — auto-growing (event)
`value` · `onChange(event)` · `minRows` (3) · `maxRows` (12) · `maxLength` (soft limit, counter turns red) · `showCount` · `helperText`

#### `PasswordInput`
`id` · `value` · `onChange(event)` · `placeholder` · `className` · `autoComplete` · `autoFocus` (no label — wrap your own)

#### `SearchInput`
`value` · `onChange(event)` · `onClear` · `placeholder`

#### `SelectField` — dropdown (value)
`value` (single) or array (`multiple`) · `onChange(value, option|options)` · `options` `[{ value, label, description?, icon?, disabled? }]` · `multiple` (chips) · `searchable` `'auto'` (>8 options) `|true|false` · `placeholder`

#### `CheckboxField` (value)
`checked` · `onChange(checked, event)` · `label` · `description` · `indeterminate` · `ariaLabel`

#### `Toggle` — switch (value)
`checked` · `onChange(checked)` · `label` · `description` · `size` `'md'|'sm'` · `layout` `'inline'|'row'` · `ariaLabel`

#### `RadioCardGroup` — choice cards (value)
`value` · `onChange(value, option)` · `options` `[{ value, label, description?, icon?, meta?, disabled? }]` · `columns` `'auto'|2|3|4`

#### `NumberField` — steppers (value)
`value` (number|null) · `onChange(number|null)` · `min` · `max` · `step` (fractional → decimals) · `suffix` · `helperText`. Clamps on blur and step; ArrowUp/Down step.

#### `DurationField` — seconds (value)
`value` (seconds|null) · `onChange(seconds|null)` · `format` `'auto'|'mm:ss'|'hh:mm:ss'` · `plainUnit` `'minutes'|'seconds'` · `min` · `max`. Accepts `1:30:00`, `45:00`, `90`, `1h 30m`, `45m`, `30s`.

#### `TagInput` (value)
`value` (string[]) · `onChange(string[])` · `suggestions` · `maxTags` · `maxTagLength` (40) · `helperText`. Enter/comma adds, Backspace removes last, paste splits, duplicates ignored.

#### `PromptComposer` — AI instruction input (string)
`value`/`onChange(text)` (optional controlled) · `defaultValue` · `onSend(text)` (return `false` to keep text) · `onStop` · `status` `'idle'|'sending'|'streaming'` · `variant` `'full'|'compact'` · `maxLength` (blocks send above) · `disabled` · `disabledReason` · `context` `[{ id, label? }]` · `onRemoveContext(id)` · `mentionOptions` `[{ value, label }]` (enables `@`) · `onAddContext(option)` · `toolbarStart` · `toolbarEnd` · `clearOnSend`.
Enter sends · Shift+Enter new line · Escape stops streaming.

#### `UploadDropzone` — validates only
`onFiles(File[])` · `onReject([{ file, reason: 'type'|'size'|'count' }])` · `accept` · `multiple` (true) · `maxSize` (bytes) · `maxFiles` · `title` · `hint` · `compact` · `disabled`.
The page uploads through its API file and renders `FileItem` rows.

#### `FileItem`
`name` · `size` · `type` · `previewUrl` (consumer creates/revokes object URLs) · `status` `'pending'|'uploading'|'done'|'error'` · `progress` · `error` · `meta` (mono, e.g. reference ID) · `onRemove` · `onRetry`.
Removing a file stored on the server needs a `ConfirmDialog`.

### Overlays

#### `Drawer`
`open` · `title` · `subtitle` · `onClose` · `size` `'sm' 360|'md' 440|'lg' 600|'xl' 860` · `error` · `footer`.
Drawer owns portal, overlay, scroll lock, Escape, transition. No `<form>` inside — the consumer wraps its own.

#### `Modal`
`open` · `onClose` · `title` · `subtitle` · `size` `'sm' 400|'md' 560|'lg' 760|'xl' 960` · `footer` · `error` · `closeOnOverlay` (true) · `showClose` (true) · `layer` `'modal'|'confirm'` · `ariaLabel` · `className`.
Focuses the first body field (or `[data-autofocus]`), traps Tab, restores focus on close.

#### `ConfirmDialog`
`isOpen` · `title` · `message` · `onConfirm` · `onCancel` · `confirmLabel` · `cancelLabel` · `isDanger` (true) · `loading` · `requireText` (user types it to enable confirm — use for lock, release, delete project).
Built on Modal (`layer="confirm"`); Cancel is focused first.

#### `Popover`
`open` · `anchorRef` · `onClose(reason: 'outside'|'escape')` · `placement` `'bottom-start'|'bottom-end'` · `matchWidth` · `offset` · `className`. Flips upward when there's no room. Base for SelectField, DropdownMenu, TagInput and mentions.

#### `Tooltip`
`content` · `placement` `'top'|'bottom'` · `delay` (300) · `disabled` · `children` (trigger).
Use for disabled reasons, full IDs and timestamps. Never the only place essential info lives (not visible on touch).

### Layout & display

#### `PageHeader`
`title` · `subtitle` · `action` · `breadcrumbs` `[{ label, to? }]` · `meta` (node under title: ID, badges, version, time)

#### `Breadcrumbs`
`items` `[{ label, to? }]` (last = current) · `maxItems` (4 — middle collapses to "…" with tooltip)

#### `Card`
`title` · `subtitle` · `actions` · `footer` · `padding` `'md'|'sm'|'none'` (none around a DataTable) · `variant` `'default'|'muted'|'outlined'` · `onClick` (whole card clickable) · `className`

#### `Tabs`
`tabs` `[{ key, label, count? }]` · `activeTab` · `onChange(key)`

#### `SectionDivider`
`label` (optional)

#### `KeyValueList`
`items` `[{ key, label, value, mono?, hidden? }]` · `layout` `'grid'|'rows'` · `columns` `'auto'|1|2|3` · `emptyValue` ('—')

#### `Avatar` / `AvatarGroup`
Avatar: `name` · `src` · `size` `'xs'|'sm'|'md'|'lg'` · `showTooltip` (stable color per name, initials fallback).
AvatarGroup: `users` `[{ id?, name, src? }]` · `max` (4) · `size` ('sm').

#### `CopyableText`
`value` · `children` (display) · `mono` (true) · `size` `'sm'|'md'`

#### `RelativeTime`
`value` (ISO|Date|timestamp) · `updateInterval` (60000) · `showTooltip` (full timestamp)

#### `NotFound`
Full-page 404 on the `*` route — not in the barrel.

### Data

#### `DataTable`
- `columns` `[{ key, header, render?(row), sortable?, sortValue?(row), align?: 'start'|'center'|'end', className? }]`
- `rows` · `rowKey` ('id' or fn) · `name` (checkbox id prefix)
- `loading` (skeleton rows when empty, dimmed when rows exist) · `skeletonRows` (5) · `emptyState`
- `sort` + `onSortChange` → server sort; without `onSortChange` → client sort
- `selectable` · `selectedKeys` · `onSelectionChange`
- `onRowClick(row)` · `rowActions(row)` (e.g. `<DropdownMenu />`) · `footer` (e.g. `<Pagination />`)
- Column widths: `column.className` sized in page CSS — never inline

#### `Pagination` (0-indexed)
`page` · `totalPages` · `totalElements` · `itemLabel` · `onPageChange`

---

## Stores

| Store | API | Persistence |
|---|---|---|
| `authStore` | `token`, `user`, `setAuth(token, user)`, `clearAuth()` | `token`, `user` |
| `useThemeStore` | `theme`, `toggleTheme()`, `setTheme()` | `migfora_theme` |
| `useLanguageStore` | `lang`, `isEnabled`, `toggleLang()`, `setLang()` | `migfora_lang` (only when enabled) |
| `useToastStore` | `toasts`, `addToast(msg, type, duration)`, `removeToast(id)` | none |

New stores: `src/store/useName.js`, zustand `create()`, default export, persisted keys prefixed `migfora_`.

## Hooks
| Hook | Purpose |
|---|---|
| `useAutoGrow(ref, value, { minRows, maxRows })` | textarea height (CSS must set px line-height) |
| `useEscape(active, handler)` | register on the escape stack |
| `useScrollLock(active)` | nested-safe body scroll lock |

## Utils
| File | Exports |
|---|---|
| `date.js` | `toDate`, `formatRelative`, `formatDateTime`, `formatDate` (Intl, current i18n language) |
| `duration.js` | `parseDuration(raw, plainUnit)` → seconds / null / NaN · `formatDuration(seconds, format)` |
| `file.js` | `formatBytes`, `matchesAccept(file, accept)`, `getFileKind(type, name)` |
| `escapeStack.js` | `pushEscape(handler)` → cleanup (use through `useEscape`) |

**Durations are always stored in seconds.** Dates are shown with `RelativeTime` or `formatDateTime`.

---

## Layout System

### AppLayout
- Renders `Navbar`, `Sidebar`, `<main className="app-layout__main">`, `ToastRenderer` (`Footer` commented out)
- Sidebar default **open**, persisted in `migfora_sidebar_open`; 248px open / 52px icon rail
- Main content offset uses `margin-inline-start`

### AuthLayout
No navbar/sidebar/footer; floating theme toggle; card uses `--auth-*` tokens.

### Navbar (fixed, 56px)
Hamburger + logo | language button (only when `isEnabled`) + theme toggle + Logout (`outline`) / Login (`primary`).

### Sidebar
- `NAV_ITEMS` defined **inside** the component (labels via `t()`), shape `[{ section, items: [{ label, path, icon }] }]`
- Icons: inline SVG 17×17, `stroke="currentColor"`, `strokeWidth=2`, inside `.sidebar__link-icon`
- Rail mode hides labels and shows `title` tooltips; Escape closes when open
- Bottom: `SidebarProfile` + copyright

### Page content
Each page root class has `padding: 32px`. Structure: `PageHeader` → content (`Card`, `DataTable`, `Tabs`…).

---

## Routing

| Path | Layout | Protected |
|---|---|---|
| `/login`, `/register` | AuthLayout | No |
| `/dashboard`, `/profile`, `/preview` | AppLayout | Yes |
| `*` | `NotFound` | No |

New routes go above `*`, wrapped in `<ProtectedRoute><AppLayout>…</AppLayout></ProtectedRoute>`.

---

## API Pattern

```js
import axiosInstance from './axiosInstance'

// ─── MOCK ─────────────────────────────────────────────────────
const MOCK_ENABLED = true

const mockGetProjects = () =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data: { items: [], totalElements: 0, totalPages: 0 } }), 800)
  })
// ──────────────────────────────────────────────────────────────

export const getProjectsApi = (params) => {
  if (MOCK_ENABLED) return mockGetProjects(params)
  return axiosInstance.get('/projects', { params })
}
```
- Mock errors use the axios shape: `reject({ response: { data: { message } } })`
- Paginated responses: `items`, `totalElements`, `totalPages`; page index 0-based
- `axiosInstance`: `baseURL` from env, Bearer token on requests, 401 → clear auth + redirect to `/login`

### Response & error handling
```js
const token = data[appConfig.auth.tokenKey]
const user  = data[appConfig.auth.userKey]

try {
  const res = await someApi(body)
  addToast(res.data?.[appConfig.auth.messageKey] || t('common.saved'), 'success')
} catch (err) {
  setError(err.response?.data?.[appConfig.auth.messageKey] || t('common.error'))
} finally {
  setLoading(false)
}
```

### appConfig
```js
{
  loginIdentifier: 'username',                       // 'email' | 'username' | 'phone'
  features: { multiLanguage, defaultLang, supportedLangs },
  auth: { tokenKey: 'token', userKey: 'user', messageKey: 'message' },
}
```

### Connecting the real backend
1. `MOCK_ENABLED = false` in each `src/api/*.js`
2. Set `VITE_API_BASE_URL`
3. Align `appConfig.auth` keys with the backend response
4. Refresh tokens → extend the axios response interceptor

---

## Task Checklists

### New page
```
□ src/pages/NewPage.jsx + src/pages/styles/NewPage.css (root class, padding 32px)
□ Route in AppRoutes.jsx (ProtectedRoute + AppLayout), above *
□ Sidebar item in NAV_ITEMS (label via t())
□ Locale keys in en.json (+ ar.json parity)
□ src/api/newPage.js with MOCK_ENABLED
□ PageHeader (breadcrumbs/meta where useful), EmptyState for zero data, Skeleton/loading for fetches
□ Page sub-components → src/components/newPage/ with styles/
□ Reuse common components — no one-off buttons, inputs, tables or dialogs
```

### New API domain
```
□ src/api/domainName.js, import axiosInstance
□ MOCK_ENABLED + mocks with 800ms delay and axios-shaped errors
□ Exported functions check MOCK_ENABLED first
□ Messages via appConfig.auth.messageKey
```

### New store
```
□ src/store/useStoreName.js with zustand create()
□ Initial state + actions; persisted keys prefixed migfora_
□ export default
```

### New sidebar item
```
□ NAV_ITEMS inside Sidebar.jsx → correct section
□ { label: t('sidebar.nav.key'), path, icon } — SVG 17×17, stroke currentColor, strokeWidth 2
□ Locale key added
```

### New common component (only when a page needs it)
```
□ src/components/common/Name.jsx + styles/Name.css, JSDoc props block
□ Default export + index.js barrel
□ Text via t(); tokens only; logical properties; base + dark layer
□ Floating UI → Popover; overlays → useEscape + useScrollLock + z-index token
□ Field → FormField shell (label, error, helper) and the onChange convention
□ Section on /preview
□ Document it in this file
```

### New status value
```
□ STATUS_VARIANT_MAP in StatusBadge.jsx
□ status.<STATUS> locale key
□ Add to /preview
```


- utils/number.js: formatNumber, formatCurrency (Intl, current language) · utils/date.js: formatMonth
- Recharts: theme with CSS on the chart container (fill/stroke on .recharts-* classes using tokens)
  and a custom Tooltip content component — no hex colors in chart props
- Dashboard data: GET /dashboard/summary → { stats, projects, decisions, jobs, spend, activity }

---

## Known Gaps (legacy — do not copy into new code)

| # | Issue | Where | Target |
|---|---|---|---|
| 1 | `[dir="rtl"]` selectors | index.css (layout/navbar/sidebar/page-header/profile), FormField.css, Navbar.css, Sidebar.css | Remove; logical properties + JSX swaps |
| 2 | Physical properties | index.css RTL block, PasswordInput.css (`right`, `padding-right`) | Convert to logical |
| 3 | Hardcoded status colors in older components | FormAlert, ToastRenderer, FormField error, FormButton danger, PasswordInput, SearchInput | Switch to `--color-*` and `--field-*` tokens |
| 4 | Literal z-index values | Navbar.css (1100), Sidebar.css (1000), ToastRenderer.css (9999) | Use `--z-*` tokens |
| 5 | axiosInstance reads/writes localStorage directly | axiosInstance.js | `useAuthStore.getState()` / `clearAuth()` |
| 6 | `console.log` and `key={lang}` remount | Navbar.jsx | Remove |
| 7 | `useLanguageStore()` called only for init | AppLayout.jsx | Remove (init now in main.jsx) |
| 8 | SubNavbar files unused | components/SubNavbar.jsx, styles/SubNavbar.css | Delete |
| 9 | Hardcoded English aria-labels | PasswordInput | Use `t()` |
| 10 | TextareaField uses its own helper class | TextareaField | Switch to `.form-field__helper` |

---

## What Claude Must Never Do

- Never use TypeScript or type annotations
- Never hardcode UI strings or aria-labels — always `t()`
- Never hardcode colors, fonts or z-index — tokens always
- Never use inline styles except dynamic RTL values and runtime-computed geometry
- Never use physical CSS properties or `[dir="rtl"]` selectors
- Never use `fetch` or raw `axios` — always `axiosInstance`
- Never use Tailwind, Bootstrap or any CSS framework
- Never read/write auth in localStorage from new code — use `useAuthStore`
- Never delete language/RTL code — gate it with `appConfig.features.multiLanguage`
- Never add raw Escape listeners or set body overflow — use `useEscape` / `useScrollLock`
- Never build a one-off button, input, select, table, dialog or tooltip when a common component exists
- Never create a page without its own CSS file, or an API file without `MOCK_ENABLED`
- Never hardcode backend response keys — use `appConfig.auth.*`
- Never put two `primary` buttons side by side, or use `danger` without `ConfirmDialog`
- Never add a common component without updating `index.js`, `/preview` and this file
- Never store durations in anything other than seconds
- Never import `SubNavbar`

---

## Quick Reference

```
New page?                → page + css + route + sidebar + locale keys + api (MOCK_ENABLED)
List of records?         → DataTable (+ Pagination in footer, DropdownMenu in rowActions)
Section container?       → Card (padding="none" around tables)
Create / edit form?      → Drawer + field components
Non-destructive dialog?  → Modal
Delete / lock / release? → ConfirmDialog (requireText for irreversible)
Pick one value?          → SelectField (few options as cards → RadioCardGroup)
Pick many?               → SelectField multiple / TagInput for free text
Numbers / runtimes?      → NumberField / DurationField (seconds)
On/off setting?          → Toggle (layout="row")
Long text?               → TextareaField
AI prompt / chat input?  → PromptComposer
Files?                   → UploadDropzone + FileItem
Metadata?                → KeyValueList
IDs / hashes?            → CopyableText
Timestamps?              → RelativeTime
Status?                  → StatusBadge (+ status.* key)
Progress / budget?       → ProgressBar
Loading?                 → Skeleton / DataTable loading / Spinner
Feedback?                → useToastStore().addToast(msg, type)
Hint on hover?           → Tooltip
People?                  → Avatar / AvatarGroup
Hierarchy trail?         → PageHeader breadcrumbs
Auth state?              → useAuthStore()
HTTP call?               → axiosInstance
Language?                → appConfig.features.multiLanguage (EN-only)
```