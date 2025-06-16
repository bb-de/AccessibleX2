import React, { createContext, useCallback, useEffect, useState, useContext } from 'react';
import { translations } from '@/lib/translation';
import { applyAccessibilityStyles } from '@/lib/a11y-helpers';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const NETLIFY_FUNCTIONS_API_BASE = 'https://shimmering-tartufo-f58e9c.netlify.app/.netlify/functions/analytics';

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
}

export const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children, shadowRoot }: { children: React.ReactNode, shadowRoot: ShadowRoot | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Initialisiere die Einstellungen aus dem localStorage beim ersten Rendern
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Fehler beim Laden der gespeicherten Einstellungen:', error);
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('accessibility-language');
    return (savedLanguage as Language) || 'en';
  });
  const { toast } = useToast();

  // Wende die Einstellungen sofort an, wenn sie sich ändern
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
    applyAccessibilityStyles(settings);
  }, [settings]);

  // Wende die Einstellungen auch beim ersten Laden an
  useEffect(() => {
    applyAccessibilityStyles(settings);
  }, []);

  // Toggle widget visibility
  const toggleWidget = useCallback(() => {
    setIsOpen(prev => {
      console.log(`Debug: Inside setIsOpen callback. Previous isOpen (prev): ${prev}`);
      const newState = !prev;
      console.log(`Debug: toggleWidget called. Setting isOpen to ${newState}.`);
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

    // Save analytics data
    try {
      apiRequest('POST', NETLIFY_FUNCTIONS_API_BASE, {
        action: 'setting-change',
        payload: {
          setting: key,
          value,
        },
      });
    } catch (error) {
      console.error('Failed to log setting change', error);
    }

    console.log(`Debug: Setting '${key}' updated to '${value}'`);
  }, []);

  // Increment numeric settings
  const incrementSetting = useCallback((
    key: keyof Pick<AccessibilitySettings, 'textSize' | 'lineHeight' | 'letterSpacing'>
  ) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: Math.min((prevSettings[key] as number) + 1, 5),
    }));

    // Log analytics
    try {
      apiRequest('POST', NETLIFY_FUNCTIONS_API_BASE, { 
        action: 'profile-applied',
        payload: {
          profileId: 'visionImpaired'
        },
      });
    } catch (error) {
      console.error('Failed to log profile application', error);
    }

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
            contrastMode: 'increased',
            fontFamily: 'readable',
            highlightFocus: true,
            highlightLinks: true,
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
            pageStructure: true,
            customCursor: true,
            cursorSize: 'bigger',
            cursorColor: 'red',
          };
        case 'screenreaderMode':
          return {
            keyboardNavigation: true,
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

    // Log analytics
    try {
      apiRequest('POST', NETLIFY_FUNCTIONS_API_BASE, {
        action: 'profile-applied',
        payload: {
          profileId
        },
      });
    } catch (error) {
      console.error('Failed to log profile application', error);
    }

    // Show toast notification
    toast({
      title: translations[language].profileApplied,
      description: translations[language][profileId],
    });
  }, [language, toast]);

  // Reset all settings to default
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);

    // Log analytics
    try {
      apiRequest('POST', NETLIFY_FUNCTIONS_API_BASE, {
        action: 'settings-reset',
        payload: {},
      });
    } catch (error) {
      console.error('Failed to log settings reset', error);
    }

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

  // Apply changes whenever settings change
  useEffect(() => {
    applyAccessibilityChanges();
  }, [settings, applyAccessibilityChanges]);

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

    // Listen for our custom events
    document.addEventListener('accessibility:page-structure-closed', handlePageStructureClose);
    document.addEventListener('accessibility:virtual-keyboard-closed', handleVirtualKeyboardClose);

    return () => {
      document.removeEventListener('accessibility:page-structure-closed', handlePageStructureClose);
      document.removeEventListener('accessibility:virtual-keyboard-closed', handleVirtualKeyboardClose);
    };
  }, [settings.pageStructure, settings.virtualKeyboard, updateSetting]);

  return (
    <AccessibilityContext.Provider
      value={{
        isOpen,
        toggleWidget,
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
      }}
    >
      {children}
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