import { useAccessibility } from "@/hooks/useAccessibility";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export function ContentTab() {
  const { settings, updateSetting, translations } = useAccessibility();

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
              onCheckedChange={(checked) => updateSetting('textToSpeech', checked)}
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
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('fontFamily', settings.fontFamily === 'readable' ? 'default' : 'readable')}
          >
            {translations.readableFont}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.fontFamily === 'dyslexic' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('fontFamily', settings.fontFamily === 'dyslexic' ? 'default' : 'dyslexic')}
          >
            {translations.dyslexiaFont}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.fontFamily === 'default' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  settings.textAlign === 'left' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  settings.textAlign === 'center' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                  settings.textAlign === 'right' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
