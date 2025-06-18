import { useEffect } from 'react';
import { useAccessibility } from './useAccessibility';

export function useTextToSpeech() {
  const { settings, updateSetting } = useAccessibility();

  useEffect(() => {
    // Wenn Vorlesefunktion aktiviert wird
    if (settings.textToSpeech) {
      // Prüfe, ob Text markiert ist
      const selection = window.getSelection();
      const selectedText = selection && selection.toString().trim();

      if (selectedText) {
        // Starte Vorlesen
        const utterance = new window.SpeechSynthesisUtterance(selectedText);
        window.speechSynthesis.speak(utterance);

        // Wenn das Vorlesen fertig ist, deaktiviere das Setting automatisch
        utterance.onend = () => {
          updateSetting('textToSpeech', false);
        };
      } else {
        // Kein Text markiert: Setting wieder deaktivieren
        updateSetting('textToSpeech', false);
        // Optional: Toast oder Hinweis anzeigen
        // z.B. window.alert('Bitte markieren Sie zuerst einen Text zum Vorlesen.');
      }
    } else {
      // Wenn deaktiviert: Stoppe das Vorlesen
      window.speechSynthesis.cancel();
    }
    // Cleanup: Stoppe das Vorlesen beim Unmounten
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [settings.textToSpeech, updateSetting]);
} 