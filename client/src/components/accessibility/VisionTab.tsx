import { useAccessibility } from "@/hooks/useAccessibility";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { MinusIcon, PlusIcon } from "lucide-react";
import { ColorSelector } from "./ColorSelector";

export function VisionTab() {
  const { 
    settings, 
    updateSetting, 
    translations,
    incrementSetting,
    decrementSetting
  } = useAccessibility();

  return (
    <div className="py-4 px-5 space-y-5">
      {/* Contrast Adjustments */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.contrastAdjustments.toUpperCase()}</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.contrastMode === 'increased' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('contrastMode', settings.contrastMode === 'increased' ? 'default' : 'increased')}
          >
            {translations.increaseContrast}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.contrastMode === 'high' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('contrastMode', settings.contrastMode === 'high' ? 'default' : 'high')}
          >
            {translations.highContrast}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.contrastMode === 'dark' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('contrastMode', settings.contrastMode === 'dark' ? 'default' : 'dark')}
          >
            {translations.darkContrast}
          </button>
          <button 
            className={`px-3 py-2 text-xs font-medium ${
              settings.contrastMode === 'light' 
                ? 'bg-primary text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            } rounded-md transition-colors`}
            onClick={() => updateSetting('contrastMode', settings.contrastMode === 'light' ? 'default' : 'light')}
          >
            {translations.lightContrast}
          </button>
        </div>
      </div>
      
      {/* Color Adjustments */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.colorAdjustments.toUpperCase()}</h3>
        <div className="space-y-3">
          <div>
            <label className="flex items-center justify-between text-sm text-gray-700 mb-1">
              <span>{translations.saturation}</span>
              <span>{settings.saturation}%</span>
            </label>
            <Slider
              value={[settings.saturation]} 
              min={0}
              max={200}
              step={5}
              onValueChange={(value) => updateSetting('saturation', value[0])}
              className="w-full"
            />
          </div>
          <div>
            <label className="flex items-center justify-between text-sm text-gray-700 mb-1">
              <span>{translations.monochrome}</span>
              <span>{settings.monochrome}%</span>
            </label>
            <Slider
              value={[settings.monochrome]} 
              min={0}
              max={100}
              step={5}
              onValueChange={(value) => updateSetting('monochrome', value[0])}
              className="w-full"
            />
          </div>
          
          {/* Custom Color Selectors - Always visible but only applied when no contrast mode is active */}
          <div className="mt-4 space-y-2">
            <ColorSelector 
              title={translations.adjustTextColors || "Adjust Text Colors"} 
              selectedColor={settings.textColor} 
              onSelectColor={(color) => updateSetting('textColor', color)} 
            />
            
            <ColorSelector 
              title={translations.adjustTitleColors || "Adjust Title Colors"} 
              selectedColor={settings.titleColor} 
              onSelectColor={(color) => updateSetting('titleColor', color)} 
            />
            
            <ColorSelector 
              title={translations.adjustBackgroundColors || "Adjust Background Colors"} 
              selectedColor={settings.backgroundColor} 
              onSelectColor={(color) => updateSetting('backgroundColor', color)} 
            />
          </div>
        </div>
      </div>
      
      {/* Text Adjustments */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.textAdjustments.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.textSize}</span>
            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => decrementSetting('textSize')}
                aria-label={translations.decreaseTextSize}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="text-sm w-5 text-center">{settings.textSize}</span>
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => incrementSetting('textSize')}
                aria-label={translations.increaseTextSize}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.lineHeight}</span>
            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => decrementSetting('lineHeight')}
                aria-label={translations.decreaseLineHeight}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="text-sm w-5 text-center">{settings.lineHeight}</span>
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => incrementSetting('lineHeight')}
                aria-label={translations.increaseLineHeight}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.letterSpacing}</span>
            <div className="flex items-center gap-2">
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => decrementSetting('letterSpacing')}
                aria-label={translations.decreaseLetterSpacing}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="text-sm w-5 text-center">{settings.letterSpacing}</span>
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                onClick={() => incrementSetting('letterSpacing')}
                aria-label={translations.increaseLetterSpacing}
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visual Preferences Toggle */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.visualPreferences.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.darkMode}</span>
            <Switch 
              checked={settings.darkMode}
              onCheckedChange={(checked) => updateSetting('darkMode', checked)}
              aria-label={translations.toggleDarkMode}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.hideImages}</span>
            <Switch 
              checked={settings.hideImages}
              onCheckedChange={(checked) => updateSetting('hideImages', checked)}
              aria-label={translations.toggleHideImages}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.stopAnimations}</span>
            <Switch 
              checked={settings.stopAnimations}
              onCheckedChange={(checked) => updateSetting('stopAnimations', checked)}
              aria-label={translations.toggleStopAnimations}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
