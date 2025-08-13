import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ThemeSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animationsEnabled: boolean;
  sidebarCollapsed?: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSetting: (key: keyof ThemeSettings, value: any) => void;
  loading: boolean;
  saveSettings: () => Promise<void>;
}

const defaultSettings: ThemeSettings = {
  theme: 'system',
  primaryColor: 'blue',
  fontSize: 'medium',
  compactMode: false,
  animationsEnabled: true,
  sidebarCollapsed: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Color options map
  const colorMap = {
    blue: '214 88% 27%',
    green: '142 76% 36%', 
    purple: '262 83% 58%',
    orange: '25 95% 53%',
    red: '0 84% 60%',
    pink: '336 75% 60%',
    indigo: '239 84% 67%',
    teal: '173 80% 40%',
    cyan: '188 86% 53%',
    emerald: '160 84% 39%',
    lime: '84 81% 44%',
    amber: '43 96% 56%',
  };

  useEffect(() => {
    if (user) {
      loadUserSettings();
    } else {
      // Load default settings for non-authenticated users
      loadDefaultSettings();
    }
  }, [user]);

  useEffect(() => {
    applyTheme(settings.theme);
  }, [settings.theme]);

  useEffect(() => {
    applyPrimaryColor(settings.primaryColor);
  }, [settings.primaryColor]);

  useEffect(() => {
    applyFontSize(settings.fontSize);
  }, [settings.fontSize]);

  useEffect(() => {
    applyCompactMode(settings.compactMode);
  }, [settings.compactMode]);

  useEffect(() => {
    applyAnimations(settings.animationsEnabled);
  }, [settings.animationsEnabled]);

  const loadUserSettings = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Fetch user theme settings from database
      const { data, error } = await supabase
        .from('user_settings')
        .select('setting_key, setting_value')
        .eq('user_id', user.id)
        .eq('category', 'appearance');

      if (error) {
        console.warn('Error loading theme settings:', error);
        loadDefaultSettings();
        return;
      }

      // Convert settings array to object
      const userSettings = data.reduce((acc, setting) => {
        acc[setting.setting_key] = setting.setting_value;
        return acc;
      }, {} as Record<string, any>);

      // Merge with defaults
      const newSettings: ThemeSettings = {
        theme: userSettings.theme || defaultSettings.theme,
        primaryColor: userSettings.primaryColor || defaultSettings.primaryColor,
        fontSize: userSettings.fontSize || defaultSettings.fontSize,
        compactMode: userSettings.compactMode ?? defaultSettings.compactMode,
        animationsEnabled: userSettings.animationsEnabled ?? defaultSettings.animationsEnabled,
        sidebarCollapsed: userSettings.sidebarCollapsed ?? defaultSettings.sidebarCollapsed,
      };

      setSettings(newSettings);
    } catch (error) {
      console.error('Error loading theme settings:', error);
      loadDefaultSettings();
    } finally {
      setLoading(false);
    }
  };

  const loadDefaultSettings = () => {
    // Apply default settings and save them to localStorage for non-authenticated users
    const saved = localStorage.getItem('theme-settings');
    if (saved) {
      try {
        const parsedSettings = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsedSettings });
      } catch {
        setSettings(defaultSettings);
      }
    } else {
      setSettings(defaultSettings);
    }
    setLoading(false);
  };

  const applyTheme = (selectedTheme: string) => {
    const root = document.documentElement;
    
    if (selectedTheme === 'dark') {
      root.classList.add('dark');
    } else if (selectedTheme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  };

  const applyPrimaryColor = (color: string) => {
    const root = document.documentElement;
    const selectedColor = colorMap[color as keyof typeof colorMap];
    
    if (selectedColor) {
      root.style.setProperty('--primary', selectedColor);
      root.style.setProperty('--ring', selectedColor);
    }
  };

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    const sizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px',
    };
    
    const selectedSize = sizeMap[size as keyof typeof sizeMap];
    if (selectedSize) {
      root.style.setProperty('--base-font-size', selectedSize);
      root.style.fontSize = selectedSize;
    }
  };

  const applyCompactMode = (compact: boolean) => {
    const root = document.documentElement;
    if (compact) {
      root.classList.add('compact-mode');
    } else {
      root.classList.remove('compact-mode');
    }
  };

  const applyAnimations = (enabled: boolean) => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.remove('no-animations');
    } else {
      root.classList.add('no-animations');
    }
  };

  const updateSetting = (key: keyof ThemeSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const saveSettings = async () => {
    if (!user) {
      // Save to localStorage for non-authenticated users
      localStorage.setItem('theme-settings', JSON.stringify(settings));
      return;
    }

    try {
      const settingsToUpdate = Object.entries(settings).map(([key, value]) => ({
        user_id: user.id,
        setting_key: key,
        setting_value: value,
        category: 'appearance',
      }));

      const { error } = await supabase
        .from('user_settings')
        .upsert(settingsToUpdate, { 
          onConflict: 'user_id,setting_key' 
        });

      if (error) {
        throw error;
      }

      console.log('Theme settings saved successfully');
    } catch (error) {
      console.error('Error saving theme settings:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSetting, loading, saveSettings }}>
      {children}
    </ThemeContext.Provider>
  );
}
