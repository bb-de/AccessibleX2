import { useAccessibility } from "@/hooks/useAccessibility";
import { Switch } from "@/components/ui/switch";

export function NavigationTab() {
  const { settings, updateSetting, translations } = useAccessibility();

  return (
    <div className="py-4 px-5 space-y-5">
      {/* Keyboard Navigation */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.keyboardNavigation.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.keyboardNav}</span>
            <Switch 
              checked={settings.keyboardNavigation}
              onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
              aria-label={translations.toggleKeyboardNavigation}
            />
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-600">
            <p className="mb-2"><strong>{translations.keyboardNavInstructions}:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>{translations.pressTab}</li>
              <li>{translations.pressEnter}</li>
              <li>{translations.pressEsc}</li>
              <li>{translations.useArrowKeys}</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Visual Assistance */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.visualAssistance.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.highlightFocus}</span>
            <Switch 
              checked={settings.highlightFocus}
              onCheckedChange={(checked) => updateSetting('highlightFocus', checked)}
              aria-label={translations.toggleHighlightFocus}
            />
          </div>
          
          {/* Custom Cursor Section */}
          <div className="border-t pt-3 mt-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-700">{translations.customCursor || "Custom Cursor"}</span>
              <Switch 
                checked={settings.customCursor}
                onCheckedChange={(checked) => updateSetting('customCursor', checked)}
                aria-label="Toggle custom cursor"
              />
            </div>
            
            {settings.customCursor && (
              <div className="bg-gray-50 p-3 rounded-lg space-y-4">
                {/* Cursor Size Selection */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{translations.cursorSize || "Cursor Size"}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      className={`relative flex items-center justify-center py-2 px-3 rounded 
                        ${settings.cursorSize === 'big' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => updateSetting('cursorSize', settings.cursorSize === 'big' ? 'default' : 'big')}
                    >
                      <span className="text-sm">{translations.medium || "Medium"}</span>
                      <span className="absolute right-2 opacity-70">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 5L16 16L9 23H23V9L16 16L5 5Z" fill="currentColor"/>
                        </svg>
                      </span>
                    </button>
                    
                    <button
                      className={`relative flex items-center justify-center py-2 px-3 rounded 
                        ${settings.cursorSize === 'bigger' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => updateSetting('cursorSize', settings.cursorSize === 'bigger' ? 'default' : 'bigger')}
                    >
                      <span className="text-sm">{translations.large || "Large"}</span>
                      <span className="absolute right-2 opacity-70">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 5L16 16L9 23H23V9L16 16L5 5Z" fill="currentColor"/>
                        </svg>
                      </span>
                    </button>
                    
                    <button
                      className={`relative flex items-center justify-center py-2 px-3 rounded 
                        ${settings.cursorSize === 'biggest' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => updateSetting('cursorSize', settings.cursorSize === 'biggest' ? 'default' : 'biggest')}
                    >
                      <span className="text-sm">{translations.extraLarge || "Extra Large"}</span>
                      <span className="absolute right-2 opacity-70">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 5L16 16L9 23H23V9L16 16L5 5Z" fill="currentColor"/>
                        </svg>
                      </span>
                    </button>
                  </div>
                </div>
                
                {/* Cursor Color Selection */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">{translations.cursorColor || "Cursor Color"}</h4>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      className={`flex flex-col items-center p-2 rounded 
                        ${settings.cursorColor === 'white' ? 'ring-2 ring-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => updateSetting('cursorColor', 'white')}
                    >
                      <div className="w-6 h-6 bg-white border border-gray-300 rounded-full mb-1"></div>
                      <span className="text-xs">White</span>
                    </button>
                    
                    <button
                      className={`flex flex-col items-center p-2 rounded 
                        ${settings.cursorColor === 'black' ? 'ring-2 ring-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => updateSetting('cursorColor', 'black')}
                    >
                      <div className="w-6 h-6 bg-black rounded-full mb-1"></div>
                      <span className="text-xs">Black</span>
                    </button>
                    
                    <button
                      className={`flex flex-col items-center p-2 rounded 
                        ${settings.cursorColor === 'blue' ? 'ring-2 ring-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => updateSetting('cursorColor', 'blue')}
                    >
                      <div className="w-6 h-6 bg-blue-500 rounded-full mb-1"></div>
                      <span className="text-xs">Blue</span>
                    </button>
                    
                    <button
                      className={`flex flex-col items-center p-2 rounded 
                        ${settings.cursorColor === 'red' ? 'ring-2 ring-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => updateSetting('cursorColor', 'red')}
                    >
                      <div className="w-6 h-6 bg-red-500 rounded-full mb-1"></div>
                      <span className="text-xs">Red</span>
                    </button>
                    
                    <button
                      className={`flex flex-col items-center p-2 rounded 
                        ${settings.cursorColor === 'green' ? 'ring-2 ring-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => updateSetting('cursorColor', 'green')}
                    >
                      <div className="w-6 h-6 bg-green-500 rounded-full mb-1"></div>
                      <span className="text-xs">Green</span>
                    </button>
                    
                    <button
                      className={`flex flex-col items-center p-2 rounded 
                        ${settings.cursorColor === 'yellow' ? 'ring-2 ring-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => updateSetting('cursorColor', 'yellow')}
                    >
                      <div className="w-6 h-6 bg-yellow-400 rounded-full mb-1"></div>
                      <span className="text-xs">Yellow</span>
                    </button>
                    
                    <button
                      className={`flex flex-col items-center p-2 rounded 
                        ${settings.cursorColor === 'purple' ? 'ring-2 ring-primary' : 'hover:bg-gray-100'}`}
                      onClick={() => updateSetting('cursorColor', 'purple')}
                    >
                      <div className="w-6 h-6 bg-purple-500 rounded-full mb-1"></div>
                      <span className="text-xs">Purple</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Additional Features */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">{translations.additionalFeatures.toUpperCase()}</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.virtualKeyboard}</span>
            <Switch 
              checked={settings.virtualKeyboard}
              onCheckedChange={(checked) => updateSetting('virtualKeyboard', checked)}
              aria-label={translations.toggleVirtualKeyboard}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">{translations.pageStructure}</span>
            <Switch 
              checked={settings.pageStructure}
              onCheckedChange={(checked) => updateSetting('pageStructure', checked)}
              aria-label={translations.togglePageStructure}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
