# PWA Customization Guide for GODIRECT Realty

## Overview
This guide explains how the Progressive Web App (PWA) customization works in the GODIRECT Realty platform. The implementation allows for a distinct user interface when the app is installed versus when it's accessed through a browser.

## How PWA Detection Works

### Detection Methods
The system uses multiple methods to detect if the app is running as an installed PWA:

1. **Display Mode Query**: `window.matchMedia('(display-mode: standalone)')`
2. **Standalone Parameter**: URL parameter `standalone=true` (iOS)
3. **Navigator Standalone**: `(window.navigator as any).standalone === true` (iOS Safari)
4. **Fullscreen Mode**: `window.matchMedia('(display-mode: fullscreen)')`

### Utility Functions
- `isRunningAsPWA()`: Returns true if running as installed PWA
- `isRunningInBrowser()`: Returns true if running in browser
- `getPWARunningContext()`: Returns detailed context information
- `usePWAStatus()`: React hook for reactive PWA status updates

## Custom UI for Installed PWA

### Distinct Interface Elements
When running as an installed PWA, the app provides:

1. **Custom Header**: Simplified header with app-specific navigation
2. **Bottom Navigation**: Mobile-friendly bottom navigation bar
3. **App-like Styling**: Special CSS classes for PWA mode
4. **Route-based Visibility**: Conditional display of elements based on current route

### UI Differences

| Feature | Browser Mode | PWA Mode |
|---------|--------------|----------|
| Header | Full website header | Simplified app header |
| Navigation | Top navigation bar | Bottom navigation bar |
| Footer | Standard footer | Hidden in dashboard routes |
| Layout | Standard web layout | App-optimized layout |
| Styling | Web-focused | Mobile-app focused |

## Implementation Details

### PWALayout Component
The [PWALayout](file:///c:/Users/gener/Godirect-realty/src/components/layout/PWALayout.tsx#L14-L161) component is the core of the customization:

1. **Detection**: Uses the `usePWAStatus` hook to detect PWA mode
2. **Styling**: Applies CSS classes for PWA-specific styling
3. **Routing**: Conditionally shows/hides elements based on route
4. **Navigation**: Provides app-like bottom navigation in PWA mode

### CSS Customization
Special CSS classes are applied when running as PWA:

- `.pwa-mode`: Applied to body when running as PWA
- `.pwa-navigation-hidden`: Hides browser navigation elements
- `.pwa-layout`: Special layout for PWA mode
- `.pwa-header`: Custom header styling
- `.pwa-bottom-nav`: Bottom navigation styling

### Route-based Visibility
The layout intelligently shows/hides elements based on:

1. **Current route** (login, dashboard, etc.)
2. **PWA status** (installed vs browser)
3. **User context** (admin vs user)

## Customization Examples

### Adding PWA-specific Content
To add content that only appears in PWA mode:

```jsx
import { usePWAStatus } from '@/hooks/usePWAStatus';

const MyComponent = () => {
  const { isPWA } = usePWAStatus();
  
  return (
    <div>
      <h1>Always visible content</h1>
      {isPWA && <div>Only visible in PWA mode</div>}
    </div>
  );
};
```

### Customizing Styles
To apply PWA-specific styles:

```css
/* In your CSS file */
.my-component {
  /* Default styles */
}

.pwa-mode .my-component {
  /* PWA-specific styles */
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
```

## Testing PWA Mode

### Desktop Testing
1. Open Chrome DevTools
2. Go to Application tab
3. Click "Install" to simulate PWA installation
4. Check if PWA-specific UI appears

### Mobile Testing
1. Open the site in Chrome on Android or Safari on iOS
2. Look for "Add to Home Screen" option
3. Install the app
4. Open the installed app to see PWA-specific UI

## Extending the Customization

### Adding New PWA Features
1. Use the `usePWAStatus` hook to detect PWA mode
2. Apply conditional rendering based on PWA status
3. Add PWA-specific CSS classes
4. Update the PWALayout component for new UI elements

### Customizing Navigation
To modify the bottom navigation:

1. Edit the [PWALayout.tsx](file:///c:/Users/gener/Godirect-realty/src/components/layout/PWALayout.tsx) component
2. Modify the navigation items in the bottom nav section
3. Update icons and labels as needed

### Route-specific Customization
To customize behavior for specific routes:

1. Modify the `shouldShowHeader`, `shouldShowNavigation`, and `shouldShowFooter` functions
2. Add new route conditions
3. Customize visibility logic

## Benefits

1. **Enhanced User Experience**: App-like interface for installed users
2. **Consistent Branding**: Different experience while maintaining brand identity
3. **Better Mobile Experience**: Optimized for touch interactions
4. **Seamless Transition**: Same core functionality across both modes
5. **Easy Maintenance**: Single codebase with conditional customization

## Future Enhancements

1. **Offline Functionality**: Enhanced offline capabilities
2. **Push Notifications**: Rich notification integration
3. **Device API Access**: Camera, location, and other device features
4. **Performance Optimization**: Further optimization for app-like performance
5. **Advanced Caching**: Intelligent caching strategies for PWA mode

This PWA customization provides a distinct, app-like experience for installed users while maintaining the full website functionality for browser users.