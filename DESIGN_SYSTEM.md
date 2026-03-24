# MFA Card Platform Design System

## Overview

A comprehensive design system for a premium cybersecurity SaaS platform that embodies trust, security, and modern sophistication. The system balances enterprise credibility with startup-grade polish.

## Brand Identity

### Core Values
- **Secure**: Protected, reliable, trustworthy
- **Intelligent**: Smart, sophisticated, thoughtful
- **Premium**: High-quality, polished, valuable
- **Modern**: Contemporary, clean, progressive
- **Controlled**: Disciplined, deliberate, precise

### Visual Direction
- **Primary**: Deep navy/graphite foundation
- **Accent**: Electric blue for interactions
- **Success**: Muted emerald for security states
- **Typography**: Inter for clarity and authority
- **Layout**: Spacious, minimal, structured

## Color System

### Primary Palette
```css
--color-primary-900: #0f172a    /* Deep Navy */
--color-primary-800: #1e293b    /* Dark Slate */
--color-primary-700: #334155    /* Medium Slate */
--color-primary-600: #475569    /* Slate */
--color-primary-500: #64748b    /* Light Slate */
--color-primary-100: #f1f5f9    /* Light Background */
--color-primary-50: #f8fafc     /* Lightest Background */
```

### Accent Colors
```css
--color-accent-600: #2563eb     /* Electric Blue */
--color-accent-500: #3b82f6     /* Primary Blue */
--color-accent-100: #dbeafe     /* Light Blue */
```

### Security Status Colors
```css
--color-security-protected: #16a34a    /* Success Green */
--color-security-partial: #d97706      /* Warning Amber */
--color-security-at-risk: #dc2626      /* Error Red */
--color-security-recovery: #2563eb    /* Recovery Blue */
--color-security-revoked: #475569     /* Neutral Slate */
```

### Semantic Colors
```css
--color-success-600: #16a34a    /* Muted Emerald */
--color-warning-600: #d97706    /* Amber */
--color-error-600: #dc2626      /* Muted Red */
--color-neutral-600: #475569    /* Slate */
```

## Typography

### Font Family
- **Primary**: Inter (modern, clean, highly readable)
- **Monospace**: JetBrains Mono (for codes, technical content)

### Type Scale
```css
--text-5xl: 3rem (48px)    /* Display Headlines */
--text-4xl: 2.25rem (36px) /* Hero Titles */
--text-3xl: 1.875rem (30px)/* Page Titles */
--text-2xl: 1.5rem (24px)  /* Section Headers */
--text-xl: 1.25rem (20px)  /* Card Titles */
--text-lg: 1.125rem (18px) /* Subheadings */
--text-base: 1rem (16px)   /* Body Copy */
--text-sm: 0.875rem (14px) /* Small Text */
--text-xs: 0.75rem (12px)  /* Captions */
```

### Font Weights
- **Light**: 300 (display text)
- **Normal**: 400 (body copy)
- **Medium**: 500 (labels, buttons)
- **Semibold**: 600 (headings)
- **Bold**: 700 (emphasis)

### Line Heights
- **Tight**: 1.25 (headlines)
- **Normal**: 1.5 (body copy)
- **Relaxed**: 1.625 (readable text)

## Spacing System

### Scale (4px base unit)
```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-12: 3rem (48px)
--space-16: 4rem (64px)
--space-24: 6rem (96px)
```

### Usage Guidelines
- **Tight spacing**: Forms, buttons, inline elements
- **Medium spacing**: Card padding, section margins
- **Generous spacing**: Page layout, hero sections

## Border Radius

### Scale
```css
--radius-sm: 0.25rem (4px)    /* Small elements */
--radius-base: 0.375rem (6px) /* Default */
--radius-md: 0.5rem (8px)     /* Cards, buttons */
--radius-lg: 0.75rem (12px)   /* Large cards */
--radius-xl: 1rem (16px)      /* Hero elements */
--radius-full: 9999px         /* Pills, badges */
```

## Shadows

### Elevation System
```css
--shadow-card: 0 1px 3px 0 rgb(15 23 42 / 0.1)
--shadow-elevated: 0 4px 6px -1px rgb(15 23 42 / 0.1)
--shadow-floating: 0 10px 15px -3px rgb(15 23 42 / 0.1)
```

### Usage
- **Card**: Default elevation for content cards
- **Elevated**: Hover states, focused elements
- **Floating**: Modals, dropdowns, overlays

## Component System

### Buttons

#### Variants
- **Primary**: Main actions, CTAs
- **Secondary**: Alternative actions
- **Outline**: Minimal emphasis
- **Ghost**: Subtle actions
- **Destructive**: Dangerous actions

#### Sizes
- **Small**: 32px height, compact forms
- **Medium**: 40px height, default
- **Large**: 48px height, prominent CTAs
- **XLarge**: 56px height, hero sections

#### States
- **Default**: Resting state
- **Hover**: Interactive feedback
- **Active**: Pressed state
- **Focus**: Keyboard navigation
- **Disabled**: Unavailable actions
- **Loading**: Processing state

### Cards

#### Variants
- **Default**: Standard content cards
- **Elevated**: Higher importance
- **Floating**: Overlay content
- **Security**: Status-indicated cards

#### Security Status Borders
- **Protected**: Green left border (4px)
- **Partial**: Amber left border (4px)
- **At Risk**: Red left border (4px)
- **Recovery**: Blue left border (4px)
- **Revoked**: Gray left border (4px)

#### Padding Options
- **None**: Custom content
- **Small**: 16px (compact)
- **Medium**: 24px (default)
- **Large**: 32px (generous)

### Badges

#### Variants
- **Success**: Positive status
- **Warning**: Caution states
- **Error**: Negative status
- **Neutral**: Informational
- **Security**: Authentication status

#### Sizes
- **Small**: 20px height
- **Medium**: 24px height
- **Large**: 28px height

### Forms

#### Input Fields
- **Height**: 40px (medium)
- **Padding**: 12px horizontal, 16px vertical
- **Border**: 1px solid neutral-200
- **Border Radius**: 8px
- **Focus**: 2px ring, accent-500

#### Labels
- **Size**: 14px, medium weight
- **Color**: neutral-900
- **Margin**: 8px bottom

#### Error States
- **Text**: 12px, error-600
- **Border**: error-500
- **Focus Ring**: error-500

## Layout System

### Container
- **Max Width**: 1280px
- **Padding**: 16px horizontal
- **Center**: Auto margins

### Grid
- **12-column system**
- **Gap**: 24px default
- **Responsive**: Mobile-first approach

### Sidebar
- **Width**: 256px (expanded)
- **Collapsed**: 64px
- **Height**: 100vh
- **Background**: neutral-50

### Header
- **Height**: 64px
- **Background**: neutral-0
- **Border**: Bottom, neutral-200

## Animation & Transitions

### Duration
- **Fast**: 100ms (micro-interactions)
- **Base**: 150ms (standard transitions)
- **Slow**: 300ms (layout changes)

### Easing
- **Ease-in-out**: Default for most transitions
- **Ease-out**: Entrance animations
- **Ease-in**: Exit animations

### Common Animations
- **Fade In**: Opacity 0 → 1, translateY(10px)
- **Slide Up**: translateY(20px) → 0
- **Scale**: scale(0.95) → scale(1)
- **Loading**: Skeleton shimmer effect

## Iconography

### Style
- **Line weight**: 2px
- **Size**: 16px, 20px, 24px
- **Color**: neutral-600 (default)
- **Rounded corners**: 2px radius

### Usage Guidelines
- **Functional**: Clear, recognizable shapes
- **Consistent**: Same style throughout
- **Minimal**: Only when necessary
- **Accessible**: Always paired with text

## Page Templates

### Landing Page
```
Hero Section (100vh)
├── Navigation (64px)
├── Headline (3xl, bold)
├── Subtitle (xl, regular)
├── Primary CTA (large)
└── Visual Element
Feature Grid (12 sections)
├── Icon + Title + Description
├── 3-column layout
└── Consistent spacing
Trust Section
├── Security credentials
├── Customer logos
└── Statistics
```

### Dashboard
```
App Shell
├── Sidebar (256px)
├── Header (64px)
└── Main Content
    ├── Overview Cards
    ├── Activity Feed
    └── Quick Actions
```

### Authentication Pages
```
Centered Layout (480px max)
├── Logo + Brand
├── Title (2xl)
├── Description (base)
├── Form Elements
└── Secondary Actions
```

## Microcopy Guidelines

### Tone
- **Calm**: Reassuring, confident
- **Precise**: Clear, unambiguous
- **Professional**: Not overly casual
- **Helpful**: Action-oriented

### Examples
- **Success**: "You're protected on 3 trusted devices."
- **Warning**: "This recovery code can be used once."
- **Security**: "Adding a new security method requires confirmation."
- **Recovery**: "Recovery access is limited until you restore a primary method."

### Error Messages
- **Specific**: "Invalid email address format"
- **Helpful**: "Try using a different email address"
- **Actionable**: "Check your email and try again"

## Accessibility

### Contrast Ratios
- **Normal Text**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **Interactive Elements**: 3:1 minimum

### Focus Management
- **Visible**: 2px outline, offset 2px
- **Consistent**: Same focus style throughout
- **Logical**: Tab order matches visual order

### Screen Readers
- **Labels**: All form elements labeled
- **Landmarks**: Proper heading hierarchy
- **Alternatives**: Text alternatives for icons

## Mobile Considerations

### Responsive Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Touch Targets
- **Minimum**: 44px × 44px
- **Recommended**: 48px × 48px
- **Spacing**: 8px between targets

### Mobile Navigation
- **Hamburger Menu**: Collapsible sidebar
- **Bottom Tabs**: Primary navigation
- **Swipe Gestures**: Card interactions

## Implementation Notes

### CSS Variables
All design tokens are available as CSS custom properties for easy theming and customization.

### Component Library
Components are built with:
- **React**: Component framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility classes
- **CSS Variables**: Design tokens

### Customization
The system supports:
- **Dark Mode**: Automatic color switching
- **Theming**: Custom color schemes
- **Scaling**: Responsive design tokens
- **Extensions**: Additional variants

## Usage Examples

### Security Dashboard Card
```jsx
<Card variant="security" securityStatus="protected">
  <CardHeader title="Account Security" description="Your account is fully protected" />
  <CardContent>
    <div className="space-y-4">
      <Badge status="protected">Protected</Badge>
      <p className="text-body-sm">3 authenticators active</p>
    </div>
  </CardContent>
</Card>
```

### Primary Action Button
```jsx
<Button variant="primary" size="lg" icon={<PlusIcon />}>
  Add Security Method
</Button>
```

### Status Badge
```jsx
<Badge status="partial" icon={<AlertTriangleIcon />}>
  Partial Protection
</Badge>
```

This design system provides a comprehensive foundation for building a premium, trustworthy cybersecurity platform that users can rely on for their most sensitive authentication needs.
