# PWA Customization Guide

This guide explains the Progressive Web App (PWA) customizations implemented in the Godirect Realty project.

## Overview

The PWA implementation provides a native app-like experience when the website is installed on a user's device. Key customizations include:

1. Distinct UI when running as an installed app vs. in a browser
2. Hidden browser-specific elements in PWA mode
3. Dedicated bottom navigation for mobile interactions
4. Route-based visibility controls for header/footer elements

## Implementation Details

### Core Components

#### PWALayout Component (`src/components/layout/PWALayout.tsx`)

This is the main wrapper component that determines the layout based on whether the app is running in PWA mode or regular web mode.

**Key Features:**
- Uses `usePWAStatus()` hook to detect PWA mode
- Applies CSS classes for PWA-specific styling
- Conditionally renders UI elements based on route and PWA status
- Implements bottom navigation for PWA mode
- Uses a simplified PWAHeader component in PWA mode with only essential elements

#### PWAHeader Component (`src/components/layout/PWAHeader.tsx`)

A simplified header component specifically designed for PWA mode that includes:
- Logo
- Currency selector
- Dark/light mode toggle

This component replaces the full Navigation component in PWA mode to avoid duplication while preserving essential functionality.

#### PWA Detection Hook (`src/hooks/usePWAStatus.ts`)

Custom hook that detects if the app is running in PWA mode by checking:
- Standalone display mode
- iOS PWA status

### UI Differences

#### PWA Mode
- Full-width content without container constraints
- Simplified header with only logo, currency selector, and dark mode toggle
- Bottom navigation bar for primary navigation
- Browser navigation elements hidden via CSS
- Dedicated styling via `pwa-mode` CSS class

#### Web Mode
- Standard responsive layout with container constraints
- Full Navigation component (TopBar + Header)
- Standard footer
- No special PWA styling

### Route-Based Visibility Controls

Certain routes hide navigation/header/footer elements in both modes:
- Authentication routes: `/login`, `/user-login`, `/user-signup`, `/admin-login`, `/forgot-password`, `/reset-password`
- Dashboard routes: `/admin-dashboard`, `/user-dashboard`

In PWA mode, dashboard routes additionally hide the header for a cleaner interface.

### Styling

PWA-specific styling is controlled through:
1. Dynamic CSS class application (`pwa-mode`, `pwa-navigation-hidden`)
2. Dedicated styles in `src/index.css` for PWA mode
3. Conditional Tailwind classes in components

### Bottom Navigation

In PWA mode, a bottom navigation bar replaces the traditional top navigation:
- Home
- Properties
- List Property
- Account

Each icon uses appropriate SVG icons with labels for clarity.

## Recent Improvements

### Version 3.0 - Header Duplication Fix
- Created a new PWAHeader component with only essential elements (logo, currency selector, dark mode toggle)
- Replaced full Navigation component with PWAHeader in PWA mode
- Eliminated duplicate header issue on both desktop website and installed PWA
- Ensured all header content remains visible and properly responsive in PWA version
- Maintained all PWA functionality (bottom navigation, route-based visibility)

### Version 2.2 - Navbar Conflict Resolution
- Fixed duplicate navbar issue appearing on both PWA and web platforms
- Removed Navigation component from PWALayout to prevent conflicts with RouteWrapper
- Added CSS rules to hide RouteWrapper navigation in PWA mode
- Maintained all PWA functionality (bottom navigation, route-based visibility)

### Version 2.1 - CSS Cleanup
- Removed unused PWA-specific CSS classes
- Maintained essential safe area and scrollbar hiding styles
- Simplified CSS structure

### Version 2.0 - Platform Header Integration
- Replaced custom PWA header with platform's own Navigation component
- Maintained all PWA functionality (bottom navigation, route-based visibility)
- Ensured currency converter and light/dark mode toggle are available in PWA mode
- Eliminated duplicate header issue on desktop website

### Version 1.0 - Initial PWA Implementation
- Created distinct app-like appearance for installed PWA
- Implemented automatic hiding of browser UI elements
- Added bottom navigation for mobile-friendly interactions
- Applied cohesive visual design with brand-consistent colors

## Testing

To test PWA functionality:
1. Install the app on a mobile device or use browser's "Install" option
2. Verify bottom navigation appears
3. Confirm browser UI elements are hidden
4. Check route-based visibility controls work correctly
5. Test light/dark mode toggle and currency converter functionality
6. Verify only one header appears on both desktop website and installed PWA
7. Confirm all header content remains visible and properly responsive in PWA version

## Future Enhancements

Potential areas for improvement:
- Offline functionality for key pages
- Push notifications
- Enhanced splash screen
- Advanced caching strategies