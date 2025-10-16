// Utility functions to detect PWA installation status

/**
 * Detect if the app is running in standalone mode (installed PWA)
 * @returns boolean - true if running as installed PWA
 */
export const isRunningAsPWA = (): boolean => {
    // Check if display-mode is standalone (PWA installed)
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return true;
    }

    // Check if the app was launched via standalone URL parameter (iOS)
    if (window.location.search.includes('standalone=true')) {
        return true;
    }

    // Check if the app is running in standalone mode (iOS Safari)
    if ((window.navigator as any).standalone === true) {
        return true;
    }

    // Check if the app is running in fullscreen mode
    if (window.matchMedia('(display-mode: fullscreen)').matches) {
        return true;
    }

    return false;
};

/**
 * Detect if the app is running in browser mode
 * @returns boolean - true if running in browser
 */
export const isRunningInBrowser = (): boolean => {
    return !isRunningAsPWA();
};

/**
 * Get detailed information about the app's running context
 * @returns object with context information
 */
export const getPWARunningContext = (): {
    isPWA: boolean;
    isBrowser: boolean;
    displayMode: string;
    userAgent: string;
} => {
    const displayMode = window.matchMedia('(display-mode: standalone)').matches
        ? 'standalone'
        : window.matchMedia('(display-mode: fullscreen)').matches
            ? 'fullscreen'
            : 'browser';

    return {
        isPWA: isRunningAsPWA(),
        isBrowser: isRunningInBrowser(),
        displayMode,
        userAgent: navigator.userAgent
    };
};