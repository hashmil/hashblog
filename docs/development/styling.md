# Styling System

HashBlog uses a sophisticated styling system built on Tailwind CSS with custom design tokens, animations, and a comprehensive dark theme. This guide covers the design system architecture, component styling patterns, and customization approaches.

## 🎨 Design System Overview

### Core Philosophy
- **Utility-First**: Primarily use Tailwind utilities with minimal custom CSS
- **Semantic Tokens**: Meaningful color and typography naming
- **Dark-First**: Designed primarily for dark mode with excellent contrast
- **Mobile-First**: Responsive design starting with mobile breakpoints
- **Performance**: Minimal CSS bundle with Tailwind purging

### Architecture Layers
```css
@layer base     /* Global defaults and typography */
@layer components   /* Reusable component styles */
@layer utilities    /* Custom utility classes */
```

## 🌈 Color Palette

### Primary Colors
```javascript
// tailwind.config.js
colors: {
  primary: "#FFFFFF",      // Main white color
  accent: "#FF5682",       // Pink/coral accent
  dark: "#121212",         // Primary dark background
  "dark-lighter": "#2a2a2a", // Lighter dark surfaces
  "text-muted": "#a0a0a0", // Muted text color
}
```

### Usage Guidelines

**Primary (`#FFFFFF`)**:
- Main text on dark backgrounds
- Card backgrounds in light contexts
- Button text and icons

**Accent (`#FF5682`)**:
- Call-to-action buttons
- Links and interactive elements
- Highlight colors and hover states
- Gradient primary color

**Dark (`#121212`)**:
- Main background color
- Card backgrounds in dark mode
- High contrast text areas

**Dark Lighter (`#2a2a2a`)**:
- Surface colors (cards, modals)
- Secondary backgrounds
- Subtle borders and dividers

**Text Muted (`#a0a0a0`)**:
- Secondary text
- Metadata (dates, tags)
- Placeholder text

### Color Usage Examples
```css
/* Correct usage with semantic meaning */
.card { @apply bg-dark-lighter border border-gray-800; }
.cta-button { @apply bg-accent text-white; }
.body-text { @apply text-white; }
.meta-text { @apply text-muted; }

/* Avoid hardcoded Tailwind colors when design tokens exist */
.wrong { @apply bg-gray-800; } /* Use bg-dark-lighter instead */
```

## ✍️ Typography System

### Font Families
```javascript
fontFamily: {
  sans: ["Work Sans", "system-ui", "sans-serif"],     // UI elements
  serif: ["Libre Baskerville", "Georgia", "serif"],  // Body content
  primary: ["Work Sans", "system-ui", "sans-serif"], // Headings
  secondary: ["Libre Baskerville", "Georgia", "serif"], // Alternative
  text: ["Libre Baskerville", "Georgia", "serif"],   // Blog content
  accent: ["Work Sans", "system-ui", "sans-serif"],  // Special elements
}
```

### Font Weights
```javascript
fontWeight: {
  primary: 800,    // Bold headings (Work Sans)
  secondary: 400,  // Normal weight (Libre Baskerville)
  text: 400,       // Body text weight
  accent: 500,     // Medium weight for UI
}
```

### Typography Hierarchy
```css
/* Headings use Work Sans with heavy weight */
h1, h2, h3, h4, h5, h6 {
  @apply font-primary font-primary; /* font-weight: 800 */
}

/* Body content uses Libre Baskerville */
body {
  @apply font-text font-text; /* font-weight: 400 */
}

/* UI elements use Work Sans medium */
.ui-element {
  @apply font-accent font-accent; /* font-weight: 500 */
}
```

### Font Loading Strategy
```html
<!-- Preconnect to Google Fonts for performance -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- Load fonts with display=swap for performance -->
<link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;800&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400&display=swap" rel="stylesheet">
```

## 🎬 Animation System

### Custom Animations
```javascript
// tailwind.config.js
animation: {
  "fade-in": "fadeIn 0.6s ease-out",
  "slide-up": "slideUp 0.5s ease-out",
  "slide-down": "slideDown 0.5s ease-out", 
  "slide-left": "slideLeft 0.5s ease-out",
  "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  "bounce-gentle": "bounceGentle 2s infinite",
}
```

### Keyframe Definitions
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

@keyframes bounceGentle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
```

### Staggered Animations
```css
/* For sequential element reveals */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
```

### Animation Guidelines
- **Duration**: Keep animations under 0.6s for perceived performance
- **Easing**: Use `ease-out` for entrance, `ease-in` for exit
- **Purpose**: Animations should enhance UX, not distract
- **Accessibility**: Respect `prefers-reduced-motion` preferences

## 📱 Responsive Design

### Breakpoint Strategy
```javascript
// Tailwind default breakpoints (mobile-first)
screens: {
  'sm': '640px',   // Small tablets
  'md': '768px',   // Tablets
  'lg': '1024px',  // Laptops
  'xl': '1280px',  // Desktops
  '2xl': '1536px', // Large desktops
}
```

### Responsive Patterns
```css
/* Mobile-first responsive design */
.responsive-card {
  @apply p-4 text-sm;          /* Mobile default */
  @apply sm:p-6 sm:text-base;  /* Small screens+ */
  @apply md:p-8 md:text-lg;    /* Medium screens+ */
  @apply lg:p-10;              /* Large screens+ */
}

/* Container with responsive max-width */
.container {
  @apply w-full max-w-4xl mx-auto px-4;
  @apply sm:px-6 lg:px-8;
}
```

### Mobile Optimizations
```css
/* Touch-friendly interactive elements */
.touch-target {
  @apply min-h-[44px] min-w-[44px]; /* 44px minimum touch target */
}

/* Mobile-specific text handling */
.mobile-text {
  @apply break-words;           /* Prevent text overflow */
  @apply leading-relaxed;       /* Better readability on small screens */
}
```

## 🌙 Dark Theme Implementation

### Theme Strategy
```javascript
// Class-based dark mode
module.exports = {
  darkMode: "class",
  // ... rest of config
}
```

### Global Dark Styles
```css
/* Base dark theme applied to body */
body {
  @apply bg-dark text-white;
}

/* Scrollbar styling for dark theme */
::-webkit-scrollbar {
  @apply w-2;
}

::-webkit-scrollbar-track {
  @apply bg-dark;
}

::-webkit-scrollbar-thumb {
  @apply bg-dark-lighter rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-600;
}
```

### Component Dark Mode
```css
/* Dark mode variations for components */
.card {
  @apply bg-dark-lighter;
  @apply border border-gray-800;
  @apply hover:border-gray-700;
}

.input {
  @apply bg-dark border-gray-700;
  @apply focus:border-accent focus:ring-accent;
}
```

## 🧩 Component Styling Patterns

### Astro Component Patterns
```astro
---
// Component with style props
interface Props {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

const { variant = 'primary', size = 'md' } = Astro.props;
---

<div class:list={[
  'base-styles',
  variant === 'primary' && 'bg-accent text-white',
  variant === 'secondary' && 'bg-dark-lighter text-white',
  size === 'sm' && 'px-3 py-1 text-sm',
  size === 'md' && 'px-4 py-2 text-base',
  size === 'lg' && 'px-6 py-3 text-lg',
]}>
  <slot />
</div>
```

### Vue Component Styling
```vue
<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  featured?: boolean;
}

const { featured = false } = defineProps<Props>();

const cardClasses = computed(() => [
  'p-6 rounded-lg transition-all duration-300',
  featured 
    ? 'bg-gradient-to-br from-dark-lighter to-dark border-accent/30' 
    : 'bg-dark-lighter border-gray-800',
  'hover:border-gray-700 hover:shadow-lg'
]);
</script>
```

### Custom CSS with @apply
```css
.blog-card {
  @apply p-6 bg-dark-lighter rounded-lg border border-gray-800;
  @apply hover:border-gray-700 transition-all duration-300;
  @apply hover:shadow-lg hover:shadow-primary/10;
}

.featured-card {
  @apply p-8 bg-gradient-to-br from-dark-lighter to-dark rounded-xl;
  @apply border border-gray-700 hover:border-primary/30;
  @apply transition-all duration-300 hover:shadow-xl hover:shadow-primary/20;
}
```

## 📝 Content Styling

### Prose Styling
```css
.prose-minimal {
  @apply prose prose-invert max-w-none;
  @apply prose-headings:font-primary prose-headings:font-primary;
  @apply prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl;
  @apply prose-p:text-white prose-p:leading-relaxed;
  @apply prose-a:text-accent prose-a:no-underline;
  @apply prose-a:hover:underline prose-a:hover:decoration-2;
  @apply prose-strong:text-white prose-strong:font-primary;
  @apply prose-code:text-accent prose-code:bg-dark-lighter;
  @apply prose-code:px-1 prose-code:py-0.5 prose-code:rounded;
}
```

### Code Syntax Highlighting
```css
/* Code block styling */
.astro-code {
  @apply bg-dark-lighter border border-gray-800 rounded-lg;
  @apply p-4 overflow-x-auto;
  @apply text-sm leading-relaxed;
}

/* Inline code styling */
code:not(.astro-code code) {
  @apply text-accent bg-dark-lighter px-1 py-0.5 rounded text-sm;
}
```

## 🎯 Performance Optimizations

### CSS Optimization
```javascript
// Tailwind purging configuration
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
  ],
  // Ensures unused styles are removed
}
```

### Critical CSS Strategy
```css
/* Inline critical styles in Layout.astro */
.critical-styles {
  /* Above-the-fold styles inlined for performance */
}
```

### Font Performance
```html
<!-- Preload critical fonts -->
<link rel="preload" href="/fonts/work-sans-800.woff2" as="font" type="font/woff2" crossorigin>
```

## 🔧 Customization Guide

### Adding Custom Colors
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1E40AF',
        'brand-green': '#059669',
        // Always extend, don't override
      }
    }
  }
}
```

### Custom Animation
```javascript
// Add to tailwind.config.js
animation: {
  'custom-bounce': 'customBounce 1s ease-in-out infinite',
}

keyframes: {
  customBounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-20px)' },
  }
}
```

### Component Variants
```css
/* Create reusable component variants */
.btn {
  @apply px-4 py-2 rounded-lg font-accent transition-colors;
}

.btn-primary {
  @apply bg-accent text-white hover:bg-accent/90;
}

.btn-secondary {
  @apply bg-dark-lighter text-white hover:bg-gray-700;
}
```

## 📋 Best Practices

### Do's
- ✅ Use design tokens instead of hardcoded colors
- ✅ Follow mobile-first responsive design
- ✅ Use semantic class names for components
- ✅ Leverage Tailwind's purging for performance
- ✅ Test animations with `prefers-reduced-motion`
- ✅ Maintain consistent spacing scale
- ✅ Use proper contrast ratios for accessibility

### Don'ts
- ❌ Override Tailwind's base styles unnecessarily
- ❌ Use `!important` declarations
- ❌ Hardcode colors that exist as design tokens
- ❌ Create overly complex animations
- ❌ Ignore responsive breakpoints
- ❌ Mix styling approaches within components
- ❌ Forget to test dark mode thoroughly

## 🐛 Common Issues and Solutions

### Font Loading Issues
```html
<!-- Ensure proper font loading -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

### Animation Performance
```css
/* Use transform instead of changing layout properties */
.good-animation {
  transform: translateY(10px); /* GPU accelerated */
}

.bad-animation {
  top: 10px; /* Causes layout recalculation */
}
```

### Responsive Issues
```css
/* Always use mobile-first approach */
.responsive-element {
  @apply text-sm;      /* Mobile default */
  @apply md:text-base; /* Tablet and up */
}
```

---

This styling system provides a solid foundation for maintaining consistent, performant, and accessible design across HashBlog while allowing for easy customization and extension.