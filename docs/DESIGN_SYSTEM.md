# 🎨 GPT Agent Platform - Design System

> **Version:** 2.0.0
> **Last Updated:** 2025-11-14
> **Status:** Production Ready
> **Based on:** KWID Platform Analysis + Modern Design Principles

---

## 📚 Table of Contents

1. [Introduction & Philosophy](#introduction--philosophy)
2. [Design Tokens](#design-tokens)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Spacing System](#spacing-system)
6. [Layout & Grid](#layout--grid)
7. [Components Library](#components-library)
8. [Motion Design](#motion-design)
9. [Accessibility](#accessibility)
10. [Dark Mode](#dark-mode)
11. [Responsive Design](#responsive-design)
12. [Best Practices](#best-practices)

---

## 🎯 Introduction & Philosophy

### Design Principles

**1. Clarity First**
- Clear visual hierarchy
- Consistent information architecture
- Intuitive navigation patterns

**2. Efficiency**
- Optimized for productivity
- Minimal cognitive load
- Quick task completion

**3. Scalability**
- Component-based architecture
- Atomic design methodology
- Future-proof token system

**4. Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

**5. Modern & Professional**
- Clean, contemporary aesthetics
- Enterprise-grade polish
- Inspired by: Linear, Vercel, Stripe, Notion

---

## 🎨 Design Tokens

### Foundation

Design tokens are the visual design atoms of the system — specifically, they are named entities that store visual design attributes.

**Token Categories:**
- Color Tokens
- Typography Tokens
- Spacing Tokens
- Shadow Tokens
- Border Radius Tokens
- Animation Tokens
- Breakpoint Tokens

---

## 🌈 Color System

### Color Philosophy

Our color system is built on **semantic naming** and **contextual usage**, ensuring consistent meaning across the platform.

### Base Palette

#### Gray Scale
```css
gray-50:  #F9FAFB   /* Backgrounds, subtle fills */
gray-100: #F3F4F6   /* Hover states, dividers */
gray-200: #E5E7EB   /* Borders, separators */
gray-300: #D1D5DB   /* Disabled states */
gray-400: #9CA3AF   /* Placeholder text */
gray-500: #6B7280   /* Secondary text */
gray-600: #4B5563   /* Primary text (dark mode) */
gray-700: #374151   /* Primary text */
gray-800: #1F2937   /* Headings */
gray-900: #111827   /* Emphasis text */
```

#### Primary (Blue)
```css
primary-50:  #EFF6FF   /* Lightest backgrounds */
primary-100: #DBEAFE   /* Light backgrounds */
primary-200: #BFDBFE   /* Subtle highlights */
primary-300: #93C5FD   /* Muted states */
primary-400: #60A5FA   /* Light interactions */
primary-500: #3B82F6   /* Primary brand color ⭐ */
primary-600: #2563EB   /* Hover states */
primary-700: #1D4ED8   /* Active states */
primary-800: #1E40AF   /* Dark emphasis */
primary-900: #1E3A8A   /* Darkest */
```

#### Success (Green)
```css
success-50:  #ECFDF5
success-100: #D1FAE5
success-500: #10B981   /* Success actions ⭐ */
success-600: #059669   /* Success hover */
success-700: #047857   /* Success active */
```

#### Error (Red)
```css
error-50:  #FEF2F2
error-100: #FEE2E2
error-500: #DC2626   /* Error/Danger ⭐ */
error-600: #B91C1C   /* Error hover */
error-700: #991B1B   /* Error active */
```

#### Warning (Amber)
```css
warning-50:  #FFFBEB
warning-100: #FEF3C7
warning-500: #F59E0B   /* Warning ⭐ */
warning-600: #D97706   /* Warning hover */
```

### Semantic Colors

#### Theme-Aware Colors (CSS Variables)

```css
/* Light Mode */
:root {
  --background: #FFFFFF;
  --foreground: #111827;

  --card: #FFFFFF;
  --card-foreground: #111827;

  --popover: #FFFFFF;
  --popover-foreground: #111827;

  --primary: #3B82F6;
  --primary-foreground: #FFFFFF;

  --secondary: #F3F4F6;
  --secondary-foreground: #111827;

  --muted: #F9FAFB;
  --muted-foreground: #6B7280;

  --accent: #EFF6FF;
  --accent-foreground: #1D4ED8;

  --destructive: #DC2626;
  --destructive-foreground: #FFFFFF;

  --border: #E5E7EB;
  --input: #E5E7EB;
  --ring: #3B82F6;

  /* Custom brand colors */
  --brand-accent: #EF4444;        /* Red accent */
  --brand-accent-strong: #FF5722; /* Orange accent */
}

/* Dark Mode */
.dark {
  --background: #1A1A1A;
  --foreground: #F9FAFB;

  --card: #111827;
  --card-foreground: #F9FAFB;

  --popover: #1F2937;
  --popover-foreground: #F9FAFB;

  --primary: #3B82F6;
  --primary-foreground: #FFFFFF;

  --secondary: #374151;
  --secondary-foreground: #F9FAFB;

  --muted: #1F2937;
  --muted-foreground: #9CA3AF;

  --accent: #1E40AF;
  --accent-foreground: #DBEAFE;

  --destructive: #DC2626;
  --destructive-foreground: #FFFFFF;

  --border: #374151;
  --input: #374151;
  --ring: #3B82F6;
}
```

### Usage Guidelines

**Background Colors:**
- `--background`: Main page background
- `--card`: Card/panel backgrounds
- `--muted`: Subtle backgrounds (hover states)

**Text Colors:**
- `--foreground`: Primary text
- `--muted-foreground`: Secondary text, labels
- `--primary-foreground`: Text on primary backgrounds

**Interactive:**
- `--primary`: Primary actions (CTAs, links)
- `--secondary`: Secondary actions
- `--destructive`: Dangerous actions
- `--border`: Borders, dividers

---

## 📝 Typography

### Font Family

```css
/* Primary Font Stack */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  'Roboto',
  'Helvetica Neue',
  Arial,
  sans-serif;

/* Monospace Stack (code, data) */
font-family-mono:
  'SF Mono',
  Monaco,
  'Cascadia Code',
  'Roboto Mono',
  Consolas,
  'Courier New',
  monospace;
```

**Font Loading:**
```html
<!-- From Bunny Fonts (GDPR-compliant) -->
@import url('https://fonts.bunny.net/css?family=inter:400,500,600,700');
```

### Type Scale

#### Headings

```css
/* H1 - Page Titles */
.heading-1 {
  font-size: 32px;      /* 2rem */
  line-height: 1.2;     /* 38.4px */
  font-weight: 700;     /* Bold */
  letter-spacing: -0.02em;
}

/* H2 - Section Titles */
.heading-2 {
  font-size: 24px;      /* 1.5rem */
  line-height: 1.3;     /* 31.2px */
  font-weight: 600;     /* Semibold */
  letter-spacing: -0.01em;
}

/* H3 - Subsection Titles */
.heading-3 {
  font-size: 20px;      /* 1.25rem */
  line-height: 1.4;     /* 28px */
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* H4 - Card Titles */
.heading-4 {
  font-size: 18px;      /* 1.125rem */
  line-height: 1.5;     /* 27px */
  font-weight: 600;
}

/* H5 - Small Headings */
.heading-5 {
  font-size: 16px;      /* 1rem */
  line-height: 1.5;     /* 24px */
  font-weight: 600;
}

/* H6 - Smallest Headings */
.heading-6 {
  font-size: 14px;      /* 0.875rem */
  line-height: 1.5;     /* 21px */
  font-weight: 600;
}
```

#### Body Text

```css
/* Large Body */
.text-large {
  font-size: 18px;      /* 1.125rem */
  line-height: 1.6;     /* 28.8px */
  font-weight: 400;
}

/* Base Body (Default) */
.text-base {
  font-size: 16px;      /* 1rem */
  line-height: 1.5;     /* 24px */
  font-weight: 400;
}

/* Small Body */
.text-small {
  font-size: 14px;      /* 0.875rem */
  line-height: 1.5;     /* 21px */
  font-weight: 400;
}

/* Extra Small */
.text-xs {
  font-size: 12px;      /* 0.75rem */
  line-height: 1.5;     /* 18px */
  font-weight: 400;
}
```

#### Utility Classes

```css
/* Weights */
.font-normal   { font-weight: 400; }
.font-medium   { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold     { font-weight: 700; }

/* Colors */
.text-primary   { color: var(--foreground); }
.text-secondary { color: var(--muted-foreground); }
.text-muted     { color: var(--muted-foreground); }
.text-accent    { color: var(--primary); }
.text-error     { color: var(--destructive); }
```

### Typography Guidelines

1. **Hierarchy**: Use consistent heading levels (don't skip levels)
2. **Line Length**: Optimal 60-75 characters per line
3. **Contrast**: Minimum 4.5:1 for normal text, 3:1 for large text
4. **Alignment**: Left-align for LTR languages
5. **Letter Spacing**: Tighter for headings (-0.02em to -0.01em)

---

## 📐 Spacing System

### Base Unit: 4px

Our spacing system uses a 4px base unit for consistency and mathematical harmony.

```css
/* Spacing Scale */
spacing-0:  0px;
spacing-1:  4px;    /* 0.25rem */
spacing-2:  8px;    /* 0.5rem */
spacing-3:  12px;   /* 0.75rem */
spacing-4:  16px;   /* 1rem */
spacing-5:  20px;   /* 1.25rem */
spacing-6:  24px;   /* 1.5rem */
spacing-8:  32px;   /* 2rem */
spacing-10: 40px;   /* 2.5rem */
spacing-12: 48px;   /* 3rem */
spacing-16: 64px;   /* 4rem */
spacing-20: 80px;   /* 5rem */
spacing-24: 96px;   /* 6rem */
```

### Semantic Spacing

```css
/* Component Internal Spacing */
--spacing-xs:  4px;   /* Tight spacing within elements */
--spacing-sm:  8px;   /* Small gaps, icon-text gaps */
--spacing-md:  16px;  /* Standard spacing */
--spacing-lg:  24px;  /* Section spacing */
--spacing-xl:  32px;  /* Large section spacing */
--spacing-2xl: 48px;  /* Page section spacing */
--spacing-3xl: 64px;  /* Major section dividers */
```

### Practical Usage

#### Buttons
```css
/* Small Button */
padding: 8px 12px;    /* spacing-2 spacing-3 */

/* Medium Button */
padding: 12px 16px;   /* spacing-3 spacing-4 */

/* Large Button */
padding: 16px 24px;   /* spacing-4 spacing-6 */
```

#### Cards
```css
/* Card Padding (Desktop) */
padding: 24px;        /* spacing-6 */

/* Card Padding (Tablet) */
padding: 20px;        /* spacing-5 */

/* Card Padding (Mobile) */
padding: 16px;        /* spacing-4 */

/* Card Gap */
margin-bottom: 24px;  /* spacing-6 */
```

#### Forms
```css
/* Field Spacing */
gap: 20px;            /* spacing-5 */

/* Label to Input */
margin-bottom: 8px;   /* spacing-2 */

/* Input to Helper Text */
margin-top: 4px;      /* spacing-1 */
```

---

## 🔲 Layout & Grid

### Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 16px;
  }
}
```

### Grid System

**12-Column Grid** (based on CSS Grid)

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* Common Layouts */
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

/* Responsive */
@media (max-width: 1024px) {
  .grid-4 { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .grid-2,
  .grid-3,
  .grid-4 { grid-template-columns: 1fr; }
}
```

### Breakpoints

```css
/* Mobile First Approach */
$breakpoint-sm: 640px;   /* Small devices */
$breakpoint-md: 768px;   /* Tablets */
$breakpoint-lg: 1024px;  /* Desktops */
$breakpoint-xl: 1280px;  /* Large desktops */
$breakpoint-2xl: 1536px; /* Extra large */
```

**Usage:**
```css
/* Mobile */
@media (max-width: 767px) { }

/* Tablet */
@media (min-width: 768px) and (max-width: 1023px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large Desktop */
@media (min-width: 1440px) { }
```

### Layout Patterns

#### App Shell
```
┌─────────────────────────────────────┐
│           Header (64px)             │
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │      Main Content        │
│ (256px)  │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

#### Header
- **Height:** 64px (fixed)
- **Padding:** 16px 24px
- **Position:** sticky top-0
- **Z-index:** 100

#### Sidebar
- **Width (expanded):** 256px
- **Width (collapsed):** 64px
- **Breakpoint:** Collapse at < 1024px
- **Z-index:** 50

#### Main Content
- **Max-width:** 1200px
- **Padding:** 24px (desktop), 16px (mobile)
- **Margin:** 0 auto

---

## 🧩 Components Library

### Button

#### Variants

**Primary**
```css
background: var(--primary);
color: var(--primary-foreground);
border: none;
border-radius: 6px;
padding: 12px 16px;
font-weight: 500;

&:hover {
  background: hsl(from var(--primary) h s calc(l - 5%));
}

&:active {
  transform: scale(0.98);
}
```

**Secondary**
```css
background: var(--secondary);
color: var(--secondary-foreground);
border: 1px solid var(--border);

&:hover {
  background: var(--muted);
}
```

**Ghost**
```css
background: transparent;
color: var(--foreground);

&:hover {
  background: var(--muted);
}
```

**Destructive**
```css
background: var(--destructive);
color: var(--destructive-foreground);

&:hover {
  background: hsl(from var(--destructive) h s calc(l - 5%));
}
```

#### Sizes

```css
/* Small */
.button-sm {
  padding: 8px 12px;
  font-size: 14px;
}

/* Medium (Default) */
.button-md {
  padding: 12px 16px;
  font-size: 16px;
}

/* Large */
.button-lg {
  padding: 16px 24px;
  font-size: 18px;
}
```

### Input

```css
.input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  line-height: 1.5;
  color: var(--foreground);
  background: var(--background);
  border: 1px solid var(--border);
  border-radius: 6px;
  transition: all 150ms ease-in-out;
}

.input:hover {
  border-color: var(--primary);
}

.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: var(--muted);
}

.input.error {
  border-color: var(--destructive);
}

.input.error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
```

### Card

```css
.card {
  background: var(--card);
  color: var(--card-foreground);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 200ms ease-in-out;
}

.card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.card-header {
  margin-bottom: 16px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-description {
  font-size: 14px;
  color: var(--muted-foreground);
}

.card-content {
  /* Main content area */
}

.card-footer {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}
```

### Modal/Dialog

```css
/* Overlay */
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 200ms ease-out;
}

/* Content */
.dialog-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 500px;
  width: calc(100% - 32px);
  max-height: calc(100vh - 64px);
  background: var(--card);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 300ms ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
```

### Table

```css
.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--muted-foreground);
  background: var(--muted);
  border-bottom: 1px solid var(--border);
}

.table td {
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid var(--border);
}

.table tr:hover {
  background: var(--muted);
}

.table tr:last-child td {
  border-bottom: none;
}
```

### Badge

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 12px;
  white-space: nowrap;
}

.badge-primary {
  background: var(--primary);
  color: var(--primary-foreground);
}

.badge-secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
}

.badge-success {
  background: #ECFDF5;
  color: #047857;
}

.badge-error {
  background: #FEF2F2;
  color: #991B1B;
}

.badge-warning {
  background: #FFFBEB;
  color: #D97706;
}
```

### Switch

```css
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: #9CA3AF;
  border-radius: 24px;
  transition: background 200ms;
}

.switch-slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background: white;
  border-radius: 50%;
  transition: transform 200ms;
}

.switch input:checked + .switch-slider {
  background: var(--primary);
}

.switch input:checked + .switch-slider:before {
  transform: translateX(20px);
}
```

### Toast/Notification

```css
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  min-width: 300px;
  max-width: 400px;
  padding: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 8px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  animation: slideInRight 300ms ease-out;
  z-index: 2000;
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.toast-success {
  border-left: 4px solid #10B981;
}

.toast-error {
  border-left: 4px solid #DC2626;
}

.toast-warning {
  border-left: 4px solid #F59E0B;
}

.toast-info {
  border-left: 4px solid #3B82F6;
}
```

---

## 🎬 Motion Design

### Animation Principles

1. **Purpose**: Every animation should have a clear purpose
2. **Performance**: Use transform and opacity for smooth 60fps
3. **Duration**: Keep under 300ms for UI interactions
4. **Easing**: Use natural easing functions

### Timing Functions

```css
/* Standard easing */
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);

/* Custom easing */
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### Duration Scale

```css
--duration-instant: 0ms;      /* No animation */
--duration-fast: 150ms;       /* Hover effects */
--duration-base: 200ms;       /* Default transitions */
--duration-slow: 300ms;       /* Modals, complex animations */
--duration-slower: 500ms;     /* Page transitions */
```

### Common Animations

**Fade In**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-in {
  animation: fadeIn 200ms ease-out;
}
```

**Slide In**
```css
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-in {
  animation: slideIn 200ms ease-out;
}
```

**Scale In**
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.scale-in {
  animation: scaleIn 200ms ease-out;
}
```

### Micro-interactions

**Button Press**
```css
.button:active {
  transform: scale(0.98);
  transition: transform 100ms ease-out;
}
```

**Card Hover**
```css
.card {
  transition: all 200ms ease-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
}
```

**Input Focus**
```css
.input {
  transition: all 150ms ease-in-out;
}

.input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
```

---

## ♿ Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast

**Minimum Ratios:**
- Normal text (< 18px): 4.5:1
- Large text (≥ 18px or ≥ 14px bold): 3:1
- UI components: 3:1

**Testing:**
```css
/* ✅ Good contrast */
color: #111827;  /* gray-900 */
background: #FFFFFF;
/* Ratio: 16.6:1 */

/* ✅ Good contrast */
color: #6B7280;  /* gray-500 */
background: #FFFFFF;
/* Ratio: 4.6:1 */

/* ❌ Poor contrast */
color: #D1D5DB;  /* gray-300 */
background: #FFFFFF;
/* Ratio: 1.9:1 - FAILS */
```

#### Keyboard Navigation

**Focus Styles:**
```css
/* Visible focus indicator */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* Remove default outline */
*:focus {
  outline: none;
}

/* Custom focus for buttons */
.button:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}
```

**Tab Order:**
```html
<!-- Maintain logical tab order -->
<header tabindex="0">
<nav tabindex="0">
<main tabindex="0">
<footer tabindex="0">
```

#### ARIA Labels

```html
<!-- Buttons with icons only -->
<button aria-label="Close modal">
  <XIcon />
</button>

<!-- Form inputs -->
<label for="email">Email</label>
<input id="email" type="email" aria-required="true" />

<!-- Error states -->
<input
  aria-invalid="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">
  Invalid email address
</span>

<!-- Loading states -->
<button aria-busy="true">
  <Spinner aria-hidden="true" />
  Loading...
</button>
```

#### Screen Reader Support

```html
<!-- Skip to main content -->
<a href="#main-content" class="sr-only">
  Skip to main content
</a>

<!-- Live regions -->
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Form submitted successfully
</div>

<!-- Hidden content -->
<span class="sr-only">
  This text is only for screen readers
</span>
```

```css
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## 🌓 Dark Mode

### Implementation Strategy

**CSS Variables Approach:**
```css
/* Automatic based on system preference */
@media (prefers-color-scheme: dark) {
  :root {
    --background: #1A1A1A;
    --foreground: #F9FAFB;
    /* ... */
  }
}

/* Manual toggle with class */
.dark {
  --background: #1A1A1A;
  --foreground: #F9FAFB;
  /* ... */
}
```

### Dark Mode Colors

**Adjustments:**
- Reduce contrast slightly (reduce eye strain)
- Avoid pure black (#000000) - use #1A1A1A
- Avoid pure white (#FFFFFF) - use #F9FAFB
- Increase saturation slightly for colors

**Shadows in Dark Mode:**
```css
/* Light mode */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

/* Dark mode - lighter, less visible */
.dark {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
```

### Images in Dark Mode

```css
/* Reduce brightness for images in dark mode */
.dark img {
  opacity: 0.9;
}

/* Invert logos if needed */
.dark .logo-light {
  display: none;
}

.dark .logo-dark {
  display: block;
}
```

---

## 📱 Responsive Design

### Mobile-First Approach

**Structure:**
```css
/* Base styles (mobile) */
.component {
  padding: 16px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 32px;
  }
}
```

### Responsive Typography

```css
/* Fluid typography */
.heading-1 {
  font-size: clamp(24px, 4vw, 32px);
}

.heading-2 {
  font-size: clamp(20px, 3vw, 24px);
}

.text-base {
  font-size: clamp(14px, 2vw, 16px);
}
```

### Touch Targets

**Minimum 44x44px for mobile:**
```css
.button-mobile {
  min-height: 44px;
  min-width: 44px;
  padding: 12px 16px;
}
```

### Responsive Images

```html
<img
  src="image-mobile.jpg"
  srcset="
    image-mobile.jpg 640w,
    image-tablet.jpg 1024w,
    image-desktop.jpg 1440w
  "
  sizes="
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  "
  alt="Description"
/>
```

---

## ✅ Best Practices

### Performance

1. **Optimize Images**
   - Use WebP format
   - Lazy load below-the-fold images
   - Provide multiple sizes (srcset)

2. **CSS**
   - Minimize CSS bundle size
   - Use CSS containment
   - Avoid expensive properties (box-shadow, filter)

3. **Animations**
   - Use transform and opacity only
   - Enable GPU acceleration
   - Respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Maintainability

1. **Use Design Tokens**
   - Never hard-code values
   - Always use CSS variables

2. **Component Naming**
   - Use BEM methodology
   - Keep names semantic

3. **Documentation**
   - Document all components
   - Provide usage examples

### Consistency

1. **Follow the System**
   - Use predefined spacing
   - Use predefined colors
   - Use predefined typography

2. **Component Composition**
   - Build complex components from simple ones
   - Reuse, don't recreate

3. **Testing**
   - Test all interactive states
   - Test keyboard navigation
   - Test screen readers

---

## 🚀 Getting Started

### Implementation Checklist

- [ ] Install Inter font from Bunny Fonts
- [ ] Copy design tokens to CSS/Tailwind config
- [ ] Implement color system (light/dark modes)
- [ ] Set up spacing system
- [ ] Configure typography scale
- [ ] Build core components (Button, Input, Card)
- [ ] Implement layout system (Grid, Container)
- [ ] Add motion/animation utilities
- [ ] Test accessibility (WCAG AA)
- [ ] Document custom components

### Tools & Resources

**Design:**
- Figma: Component library
- Coolors: Color palette generator
- Type Scale: Typography calculator

**Development:**
- Tailwind CSS: Utility framework
- Radix UI: Accessible components
- Framer Motion: Animations

**Testing:**
- WebAIM Contrast Checker
- axe DevTools
- Lighthouse (Chrome DevTools)

---

## 📖 References

1. **Material Design 3** - Google's design system
2. **Human Interface Guidelines** - Apple's design principles
3. **Inclusive Components** - Accessibility patterns
4. **Refactoring UI** - Visual design best practices
5. **Laws of UX** - User psychology principles

---

**Maintained by:** Design Team
**Questions?** Contact: design@gpt-agent-platform.com
**Version:** 2.0.0
**Last Updated:** 2025-11-14
