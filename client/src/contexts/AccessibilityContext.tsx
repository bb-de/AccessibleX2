// Copyright (c) 2024 brandingbrothers.de. All rights reserved.
import React, { createContext, useCallback, useEffect, useState, useContext } from 'react';
import { translations } from '@/lib/translation';
import { applyAccessibilityStyles } from '@/lib/a11y-helpers';
import { useToast } from '@/hooks/use-toast';
import { useDeviceDetection } from '@/hooks/use-mobile';
import { Toaster } from '@/components/ui/toaster';

const NETLIFY_FUNCTIONS_API_BASE = 'https://shimmering-tartufo-f58e9c.netlify.app/.netlify/functions/analytics';

// Robuste API-Request-Funktion, die keine Exceptions wirft
async function safeApiRequest(method: string, url: string, data?: unknown): Promise<void> {
  try {
    const response = await fetch(url, {
      method,
      headers: data ? { "Content-Type": "application/json" } : {},
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });
    
    if (!response.ok) {
      console.warn(`API request failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.warn('API request failed:', error);
  }
}

// Define types
export type AccessibilityProfileId = 
  | 'visionImpaired' 
  | 'cognitiveDisability' 
  | 'senior' 
  | 'motorImpaired' 
  | 'adhdFriendly' 
  | 'dyslexiaFriendly'
  | 'efficiencyMode'
  | 'screenreaderMode';

export type ContrastMode = 'default' | 'increased' | 'high' | 'dark' | 'light';
export type FontFamily = 'default' | 'readable' | 'dyslexic';
export type Language = 'en' | 'de' | 'fr' | 'es';
export type TextAlign = 'default' | 'left' | 'center' | 'right';

export type ColorOption = 'default' | 'blue' | 'purple' | 'red' | 'orange' | 'teal' | 'green' | 'white' | 'black';

export type CursorType = 'default' | 'big' | 'bigger' | 'biggest';
export type CursorColor = 'white' | 'black' | 'blue' | 'red' | 'green' | 'yellow' | 'purple';

export interface AccessibilitySettings {
  // Vision settings
  contrastMode: ContrastMode;
  saturation: number;
  monochrome: number;
  textColor: ColorOption;
  titleColor: ColorOption;
  backgroundColor: ColorOption;
  textSize: number;
  lineHeight: number;
  letterSpacing: number;
  darkMode: boolean;
  hideImages: boolean;
  stopAnimations: boolean;

  // Content settings
  highlightTitles: boolean;
  highlightLinks: boolean;
  textToSpeech: boolean;
  readingMask: boolean;
  readingGuide: boolean;
  fontFamily: FontFamily;
  wordSpacing: number;
  textAlign: TextAlign;

  // Navigation settings
  keyboardNavigation: boolean;
  highlightFocus: boolean;
  customCursor: boolean;
  cursorSize: CursorType;
  cursorColor: CursorColor;
  virtualKeyboard: boolean;
  pageStructure: boolean;
}

export const defaultSettings: AccessibilitySettings = {
  contrastMode: 'default',
  saturation: 100,
  monochrome: 0,
  textColor: 'default',
  titleColor: 'default',
  backgroundColor: 'default',
  textSize: 0,
  lineHeight: 0,
  letterSpacing: 0,
  darkMode: false,
  hideImages: false,
  stopAnimations: false,

  highlightTitles: false,
  highlightLinks: false,
  textToSpeech: false,
  readingMask: false,
  readingGuide: false,
  fontFamily: 'default',
  wordSpacing: 0,
  textAlign: 'default',

  keyboardNavigation: false,
  highlightFocus: false,
  customCursor: false,
  cursorSize: 'default',
  cursorColor: 'black',
  virtualKeyboard: false,
  pageStructure: false,
};

interface AccessibilityContextType {
  isOpen: boolean;
  toggleWidget: () => void;
  closeWidget: () => void;
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => void;
  incrementSetting: (key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>) => void;
  decrementSetting: (key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>) => void;
  resetSettings: () => void;
  applyProfile: (profileId: AccessibilityProfileId) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: typeof translations['en'];
  applyAccessibilityChanges: () => void;
  shadowRoot: ShadowRoot | null;
  deviceInfo: {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isTouchDevice: boolean;
    deviceType: 'mobile' | 'tablet' | 'desktop';
    screenWidth: number;
    screenHeight: number;
    userAgent: string;
    orientation: 'portrait' | 'landscape';
    isPortrait: boolean;
    isLandscape: boolean;
    orientationAngle: number;
  };
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children, shadowRoot }: { children: React.ReactNode, shadowRoot: ShadowRoot | null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  const [language, setLanguage] = useState<Language>('en');
  const deviceInfo = useDeviceDetection();

  // Load saved settings on initial render
  useEffect(() => {
    console.log('🔄 Loading saved settings...');
    const savedSettings = localStorage.getItem('accessibility-settings');
    const savedLanguage = localStorage.getItem('accessibility-language');
    
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        console.log('✅ Loaded settings from localStorage:', parsedSettings);
        setSettings(parsedSettings);
      } catch (error) {
        console.error('❌ Failed to parse saved accessibility settings', error);
      }
    } else {
      console.log('ℹ️ No saved settings found, using defaults');
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage as Language);
    }
    
    setIsInitialized(true);
    console.log('✅ Initialization complete');
  }, []);

  useEffect(() => {
    document.body.classList.toggle('is-mobile', deviceInfo.isMobile);
    document.body.classList.toggle('is-desktop', !deviceInfo.isMobile);
  }, [deviceInfo.isMobile]);

  // Wende die Einstellungen an, wenn sie sich ändern (nur nach der Initialisierung)
  useEffect(() => {
    if (isInitialized) {
      console.log('🔄 Applying settings:', settings);
      localStorage.setItem('accessibility-settings', JSON.stringify(settings));
      applyAccessibilityStyles(settings, shadowRoot);
    } else {
      console.log('⏳ Skipping settings application - not yet initialized');
    }
  }, [settings, shadowRoot, isInitialized]);

  // Lausche auf Nachrichten vom übergeordneten Fenster, um den Widget-Status zu synchronisieren
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Stellen Sie sicher, dass die Nachricht von einer vertrauenswürdigen Quelle stammt, falls möglich
      // Für diese Implementierung verwenden wir '*' als origin, aber in einer Produktionsumgebung sollte event.origin überprüft werden.
      if (event.data.type === 'accessibility-widget-toggle') {
        setIsOpen(event.data.isOpen);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); // Leere Abhängigkeitsliste, um sicherzustellen, dass der Listener nur einmal hinzugefügt wird

  const closeWidget = useCallback(() => {
    setIsOpen(false);
    window.parent.postMessage({
      type: 'accessibility-widget-toggle',
      isOpen: false,
    }, '*');
  }, []);

  // Toggle widget visibility
  const toggleWidget = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev;
      // Sende eine Nachricht an das übergeordnete Fenster, um den Status zu synchronisieren
      // Dies ist wichtig, wenn das Widget von innen geschlossen wird (z.B. durch das 'X' oder 'Klick außerhalb')
      window.parent.postMessage({
        type: 'accessibility-widget-toggle',
        isOpen: newState,
      }, '*');
      return newState;
    });
  }, []);

  // Update a single setting
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: value,
    }));

    // Save analytics data (non-blocking)
    setTimeout(() => {
      try {
        safeApiRequest('POST', NETLIFY_FUNCTIONS_API_BASE, {
          action: 'setting-change',
          payload: {
            setting: key,
            value,
          },
        });
      } catch (error) {
        console.error('Failed to log setting change', error);
      }
    }, 0);
  }, []);

  // Increment numeric settings
  const incrementSetting = useCallback((
    key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: Math.min((prevSettings[key] as number) + 1, 5),
    }));

    // Log analytics (non-blocking)
    setTimeout(() => {
      try {
        safeApiRequest('POST', NETLIFY_FUNCTIONS_API_BASE, { 
          action: 'profile-applied',
          payload: {
            profileId: 'visionImpaired'
          },
        });
      } catch (error) {
        console.error('Failed to log profile application', error);
      }
    }, 0);

    // Show toast notification
    toast({
      title: translations[language].profileApplied,
      description: translations[language]['visionImpaired'],
    });
  }, [language, toast]);

  // Decrement numeric settings
  const decrementSetting = useCallback((
    key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: Math.max((prevSettings[key] as number) - 1, -5),
    }));
  }, []);

  // Apply a predefined profile
  const applyProfile = useCallback((profileId: AccessibilityProfileId) => {
    // First reset to default settings
    const defaultSettingsCopy = { ...defaultSettings };

    // Then apply profile-specific settings
    const profileSettings: Partial<AccessibilitySettings> = (() => {
      switch (profileId) {
        case 'visionImpaired':
          return {
            textSize: 1,                   // Ein Schritt vergrößerte Schrift
            contrastMode: 'increased',     // Erhöhter Kontrast 
            fontFamily: 'readable',        // Lesbare Schrift
            textAlign: 'left',             // Linksbündiger Text
          };
        case 'cognitiveDisability':
          return {
            fontFamily: 'readable',
            lineHeight: 2,
            wordSpacing: 30,
            textAlign: 'left',
            highlightTitles: true,
            hideImages: false,
          };
        case 'senior':
          return {
            textSize: 2,
            lineHeight: 2,
            letterSpacing: 0,
            highlightTitles: true,
            highlightLinks: true,
            customCursor: true,
            cursorSize: 'bigger',
            keyboardNavigation: true,
          };
        case 'motorImpaired':
          return {
            keyboardNavigation: true,
            highlightFocus: true,
            customCursor: true,
            cursorSize: 'biggest',
            cursorColor: 'black',
          };
        case 'adhdFriendly':
          return {
            readingMask: true,
            stopAnimations: true,
            highlightFocus: true,
            // hideImages entfernt, damit Icons im ADHS-Modus sichtbar bleiben
          };
        case 'dyslexiaFriendly':
          return {
            fontFamily: 'dyslexic',
            lineHeight: 2,
            wordSpacing: 50,
            letterSpacing: 1,
            textAlign: 'left',
          };
        case 'efficiencyMode':
          return {
            stopAnimations: true,
            darkMode: true,
            highlightLinks: true,
            highlightFocus: true,
            customCursor: true,
            cursorSize: 'bigger',
            cursorColor: 'red',
          };
        case 'screenreaderMode':
          return {
            textToSpeech: true,
          };
        default:
          return {};
      }
    })();

    // Apply default settings first, then profile settings
    setSettings({
      ...defaultSettingsCopy,
      ...profileSettings,
    });

    // Log analytics (non-blocking)
    setTimeout(() => {
      try {
        safeApiRequest('POST', NETLIFY_FUNCTIONS_API_BASE, {
          action: 'profile-applied',
          payload: {
            profileId
          },
        });
      } catch (error) {
        console.error('Failed to log profile application', error);
      }
    }, 0);

    // Show toast notification
    toast({
      title: translations[language].profileApplied,
      description: translations[language][profileId],
    });
  }, [language, toast]);

  // Reset all settings to default
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);

    // Styles sofort zurücksetzen!
    applyAccessibilityStyles(defaultSettings, null);

    // Log analytics (non-blocking)
    setTimeout(() => {
      try {
        safeApiRequest('POST', NETLIFY_FUNCTIONS_API_BASE, {
          action: 'settings-reset',
          payload: {},
        });
      } catch (error) {
        console.error('Failed to log settings reset', error);
      }
    }, 0);

    // Show toast notification
    toast({
      title: translations[language].settingsReset,
      description: translations[language].settingsResetDescription,
    });
  }, [language, toast]);

  // Handle Alt+U keyboard shortcut for settings reset
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Alt+U combination
      if (event.altKey && event.key === 'u') {
        resetSettings();
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resetSettings]);

  // Apply all accessibility changes to the DOM
  const applyAccessibilityChanges = useCallback(() => {
    applyAccessibilityStyles(settings, shadowRoot || undefined);
  }, [settings, shadowRoot]);

  // Listen for page structure panel close event
  useEffect(() => {
    const handlePageStructureClose = () => {
      if (settings.pageStructure) {
        updateSetting('pageStructure', false);
      }
    };

    const handleVirtualKeyboardClose = () => {
      if (settings.virtualKeyboard) {
        updateSetting('virtualKeyboard', false);
      }
    };

    // NEU: Keyboard Navigation Overlay geschlossen
    const handleKeyboardNavigationClose = () => {
      if (settings.keyboardNavigation) {
        updateSetting('keyboardNavigation', false);
      }
    };

    // Listen for our custom events
    document.addEventListener('accessibility:page-structure-closed', handlePageStructureClose);
    document.addEventListener('accessibility:virtual-keyboard-closed', handleVirtualKeyboardClose);
    document.addEventListener('accessibility:keyboard-navigation-closed', handleKeyboardNavigationClose);

    return () => {
      document.removeEventListener('accessibility:page-structure-closed', handlePageStructureClose);
      document.removeEventListener('accessibility:virtual-keyboard-closed', handleVirtualKeyboardClose);
      document.removeEventListener('accessibility:keyboard-navigation-closed', handleKeyboardNavigationClose);
    };
  }, [settings.pageStructure, settings.virtualKeyboard, settings.keyboardNavigation, updateSetting]);

  const value: AccessibilityContextType = {
    isOpen,
    toggleWidget,
    closeWidget,
    settings,
    updateSetting,
    incrementSetting,
    decrementSetting,
    resetSettings,
    applyProfile,
    language,
    setLanguage,
    translations: {...translations.en, ...translations[language]},
    applyAccessibilityChanges,
    shadowRoot,
    deviceInfo,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      <Toaster />
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}