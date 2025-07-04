// Copyright (c) 2024 brandingbrothers.de. All rights reserved.
import { useAccessibility } from "@/hooks/useAccessibility";
import { RotateCcw } from "lucide-react";

export function WidgetFooter() {
  const { translations, resetSettings } = useAccessibility();
  
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
      {/* Reset Button */}
      <div className="flex justify-center mb-4">
        <button 
          className="flex items-center text-sm bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            resetSettings();
          }}
          aria-label={translations.resetSettingsAria || "Reset all accessibility settings"}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {translations.resetSettings || "Reset All Settings"}
        </button>
      </div>
      
      <p className="text-xs text-gray-500 text-center font-medium">
        <a
          href="https://www.brandingbrothers.de"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline focus:underline outline-none"
          tabIndex={0}
        >
          {translations.footerText}
        </a>
      </p>

      <div className="flex justify-center mt-2">
        <p className="text-xs text-gray-400">
          {translations.keyboardShortcut || "Keyboard Shortcut"}: <kbd className="px-1 py-0.5 bg-gray-200 rounded">Alt</kbd> + <kbd className="px-1 py-0.5 bg-gray-200 rounded">U</kbd>
        </p>
      </div>
    </div>
  );
}
