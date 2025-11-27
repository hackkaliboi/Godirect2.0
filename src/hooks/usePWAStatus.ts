import { useState, useEffect } from 'react';
import { isRunningAsPWA, getPWARunningContext } from '@/lib/pwa-detection';

/**
 * Hook to detect PWA status and provide reactive updates
 * @returns object with PWA status information
 */
export const usePWAStatus = () => {
    const [isPWA, setIsPWA] = useState(false);
    const [displayMode, setDisplayMode] = useState('');

    useEffect(() => {
        // Check initial status
        const context = getPWARunningContext();
        setIsPWA(context.isPWA);
        setDisplayMode(context.displayMode);

        // Listen for changes in display mode
        const handleDisplayModeChange = (e: MediaQueryListEvent) => {
            setIsPWA(e.matches);
            setDisplayMode(e.matches ? 'standalone' : 'browser');
        };

        const mediaQuery = window.matchMedia('(display-mode: standalone)');
        mediaQuery.addEventListener('change', handleDisplayModeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleDisplayModeChange);
        };
    }, []);

    return {
        isPWA,
        isBrowser: !isPWA,
        displayMode
    };
};