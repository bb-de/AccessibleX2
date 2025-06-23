// Copyright (c) 2024 brandingbrothers.de. All rights reserved.
import { useAccessibility } from "@/hooks/useAccessibility";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useEffect } from "react";
import { exportSpeechControlsOverlayWithLabels, SpeechControlsLabels } from "./SpeechControls";
import { useDeviceDetection } from "@/hooks/use-mobile";

const overlayLabels: Record<string, SpeechControlsLabels> = {
  de: {
    title: 'Vorlesefunktion',
    language: 'Sprache:',
    start: 'Start',
    pause: 'Pause',
    stop: 'Stopp',
    useSelection: 'Markierten Text übernehmen',
    speed: 'Geschwindigkeit:',
    status: 'Status:',
    statusIdle: 'Bereit',
    statusPlaying: 'Liest vor...',
    statusPaused: 'Pausiert',
    statusError: 'Fehler beim Vorlesen',
    errorNoText: 'Text zum Vorlesen eingeben oder markieren...',
    errorNoSelection: 'Bitte markieren Sie zuerst einen Text.',
    close: '×',
  },
  en: {
    title: 'Text to Speech',
    language: 'Language:',
    start: 'Start',
    pause: 'Pause',
    stop: 'Stop',
    useSelection: 'Use selected text',
    speed: 'Speed:',
    status: 'Status:',
    statusIdle: 'Ready',
    statusPlaying: 'Reading...',
    statusPaused: 'Paused',
    statusError: 'Error while reading',
    errorNoText: 'Enter or select text to read aloud...',
    errorNoSelection: 'Please select some text first.',
    close: '×',
  },
  fr: {
    title: 'Synthèse vocale',
    language: 'Langue:',
    start: 'Démarrer',
    pause: 'Pause',
    stop: 'Arrêter',
    useSelection: 'Utiliser le texte sélectionné',
    speed: 'Vitesse:',
    status: 'Statut:',
    statusIdle: 'Prêt',
    statusPlaying: 'Lecture...',
    statusPaused: 'En pause',
    statusError: 'Erreur lors de la lecture',
    errorNoText: 'Saisissez ou sélectionnez le texte à lire...',
    errorNoSelection: 'Veuillez d\'abord sélectionner un texte.',
    close: '×',
  },
  es: {
    title: 'Texto a voz',
    language: 'Idioma:',
    start: 'Iniciar',
    pause: 'Pausa',
    stop: 'Detener',
    useSelection: 'Usar texto seleccionado',
    speed: 'Velocidad:',
    status: 'Estado:',
    statusIdle: 'Listo',
    statusPlaying: 'Leyendo...',
    statusPaused: 'En pausa',
    statusError: 'Error al leer',
    errorNoText: 'Introduce o selecciona texto para leer...',
    errorNoSelection: 'Por favor, selecciona primero un texto.',
    close: '×',
  },
};

const overlayLangMap: Record<string, string> = {
  de: 'de-DE',
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
};

export function ContentTab() {
  useTextToSpeech();
  const { settings, updateSetting, translations, language, closeWidget } = useAccessibility();
  const deviceInfo = useDeviceDetection();

  useEffect(() => {
    const labels = overlayLabels[language] || overlayLabels['de'];
    const lang = overlayLangMap[language] || 'de-DE';
    exportSpeechControlsOverlayWithLabels(settings.textToSpeech, labels, lang, deviceInfo.isMobile);
    return () => exportSpeechControlsOverlayWithLabels(false, labels, lang, deviceInfo.isMobile);
  }, [settings.textToSpeech, language, deviceInfo.isMobile]);

  // Synchronisiere das Setting, wenn das Overlay per X geschlossen wird
  useEffect(() => {
    const handler = () => updateSetting('textToSpeech', false);
    window.addEventListener('speechControlsClosed', handler);
    return () => window.removeEventListener('speechControlsClosed', handler);
  }, [updateSetting]);

  return (
    <div className="py-4 px-5 space-y-5">
      {/* Content Adjustments */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.contentAdjustments.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.highlightTitles}</span>
            <Switch 
              checked={settings.highlightTitles}
              onCheckedChange={(checked) => updateSetting('highlightTitles', checked)}
              aria-label={translations.toggleHighlightTitles}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.highlightLinks}</span>
            <Switch 
              checked={settings.highlightLinks}
              onCheckedChange={(checked) => updateSetting('highlightLinks', checked)}
              aria-label={translations.toggleHighlightLinks}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.textToSpeech}</span>
            <Switch 
              checked={settings.textToSpeech}
              onCheckedChange={(checked) => {
                updateSetting('textToSpeech', checked);
              }}
              aria-label={translations.toggleTextToSpeech}
            />
          </div>
        </div>
      </div>
      
      {/* Reading Tools */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.readingTools.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.readingMask}</span>
            <Switch 
              checked={settings.readingMask}
              onCheckedChange={(checked) => updateSetting('readingMask', checked)}
              aria-label={translations.toggleReadingMask}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.readingGuide}</span>
            <Switch 
              checked={settings.readingGuide}
              onCheckedChange={(checked) => updateSetting('readingGuide', checked)}
              aria-label={translations.toggleReadingGuide}
            />
          </div>
        </div>
      </div>
      
      {/* Font Adjustments */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.fontAdjustments.toUpperCase()}</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.fontFamily === 'readable' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('fontFamily', settings.fontFamily === 'readable' ? 'default' : 'readable')}
          >
            {translations.readableFont}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.fontFamily === 'dyslexic' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('fontFamily', settings.fontFamily === 'dyslexic' ? 'default' : 'dyslexic')}
          >
            {translations.dyslexiaFont}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.fontFamily === 'default' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('fontFamily', 'default')}
          >
            {translations.resetFont}
          </button>
        </div>
      </div>
      
      {/* Alignment & Spacing */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.alignmentSpacing.toUpperCase()}</h3>
        <div className="space-y-3">
          <div>
            <label className="flex items-center justify-between text-sm text-gray-700 mb-1">
              <span>{translations.wordSpacing}</span>
              <span>{settings.wordSpacing}%</span>
            </label>
            <Slider
              value={[settings.wordSpacing]} 
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => updateSetting('wordSpacing', value[0])}
              className="w-full"
            />
          </div>
          <div className="mt-4">
            <h4 className="text-sm text-gray-700 mb-2">{translations.textAlignment || "Text Alignment"}</h4>
            <div className="grid grid-cols-3 gap-2">
              <button 
                className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${
                  settings.textAlign === 'left' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => updateSetting('textAlign', settings.textAlign === 'left' ? 'default' : 'left')}
                aria-label="Align text left"
              >
                <div className="flex flex-col items-start mb-2 w-8">
                  <div className="w-6 h-1 bg-current mb-1"></div>
                  <div className="w-4 h-1 bg-current mb-1"></div>
                  <div className="w-5 h-1 bg-current"></div>
                </div>
                <span className="text-xs">{translations.textAlignLeft || "Align Left"}</span>
              </button>
              
              <button 
                className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${
                  settings.textAlign === 'center' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => updateSetting('textAlign', settings.textAlign === 'center' ? 'default' : 'center')}
                aria-label="Align text center"
              >
                <div className="flex flex-col items-center mb-2 w-8">
                  <div className="w-6 h-1 bg-current mb-1"></div>
                  <div className="w-4 h-1 bg-current mb-1"></div>
                  <div className="w-5 h-1 bg-current"></div>
                </div>
                <span className="text-xs">{translations.textAlignCenter || "Align Center"}</span>
              </button>
              
              <button 
                className={`flex flex-col items-center justify-center p-3 rounded-md transition-colors ${
                  settings.textAlign === 'right' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                onClick={() => updateSetting('textAlign', settings.textAlign === 'right' ? 'default' : 'right')}
                aria-label="Align text right"
              >
                <div className="flex flex-col items-end mb-2 w-8">
                  <div className="w-6 h-1 bg-current mb-1"></div>
                  <div className="w-4 h-1 bg-current mb-1"></div>
                  <div className="w-5 h-1 bg-current"></div>
                </div>
                <span className="text-xs">{translations.textAlignRight || "Align Right"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
