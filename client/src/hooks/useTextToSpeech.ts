import { useEffect } from 'react';
import { useAccessibility } from './useAccessibility';

export function useTextToSpeech() {
  const { settings } = useAccessibility();

  useEffect(() => {
    // Wenn deaktiviert: Stoppe das Vorlesen
    if (!settings.textToSpeech) {
      window.speechSynthesis.cancel();
    }
    // Cleanup: Stoppe das Vorlesen beim Unmounten
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [settings.textToSpeech]);
} 