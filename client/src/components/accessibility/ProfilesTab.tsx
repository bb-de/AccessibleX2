import { useState, useEffect } from "react";
import { useAccessibility } from "@/hooks/useAccessibility";
import { accessibilityProfiles } from "@/lib/accessibility-profiles";
import { AccessibilityProfileId } from "@/contexts/AccessibilityContext";
import { Check, Eye } from "lucide-react";

export function ProfilesTab() {
  const { applyProfile, translations, settings, resetSettings } = useAccessibility();
  const [activeProfile, setActiveProfile] = useState<AccessibilityProfileId | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<AccessibilityProfileId | null>(null);
  
  // Helper function to determine if a profile is active based on its settings
  const isProfileActive = (profileId: AccessibilityProfileId) => {
    switch (profileId) {
      case 'visionImpaired':
        return settings.textSize === 1 && 
               settings.contrastMode === 'increased' && 
               settings.fontFamily === 'readable' && 
               settings.textAlign === 'left';
      case 'cognitiveDisability':
        return settings.fontFamily === 'readable' && 
               settings.lineHeight === 2 && 
               settings.wordSpacing === 30 && 
               settings.textAlign === 'left' && 
               settings.highlightTitles &&
               settings.hideImages === false;
      case 'senior':
        return settings.textSize === 2 &&
               settings.lineHeight === 2 &&
               settings.letterSpacing === 0 &&
               settings.highlightTitles &&
               settings.highlightLinks &&
               settings.customCursor &&
               settings.cursorSize === 'bigger';
               
      case 'motorImpaired':
        return settings.keyboardNavigation && 
               settings.highlightFocus && 
               settings.customCursor && 
               settings.cursorSize === 'biggest' && 
               settings.cursorColor === 'black';
      case 'adhdFriendly':
        return settings.readingMask && 
               settings.stopAnimations && 
               settings.highlightFocus;
      case 'dyslexiaFriendly':
        return settings.fontFamily === 'dyslexic' && 
               settings.lineHeight === 2 && 
               settings.wordSpacing === 50 && 
               settings.letterSpacing === 1 && 
               settings.textAlign === 'left';
      case 'efficiencyMode':
        return settings.stopAnimations &&
               settings.darkMode &&
               settings.highlightLinks &&
               settings.highlightFocus &&
               settings.customCursor &&
               settings.cursorSize === 'bigger' &&
               settings.cursorColor === 'red';
      case 'screenreaderMode':
        return settings.textToSpeech;
      default:
        return false;
    }
  };
  
  // Update the active profile when settings change
  useEffect(() => {
    const currentActiveProfile = accessibilityProfiles.find(profile => 
      isProfileActive(profile.id)
    )?.id || null;
    
    setActiveProfile(currentActiveProfile);
  }, [settings]);

  // Handle profile click - directly activate the profile or deactivate if already active
  const handleProfileClick = (profileId: AccessibilityProfileId) => {
    // Check if this profile is already active
    if (activeProfile === profileId) {
      // Deactivate the profile
      resetSettings();
      setActiveProfile(null);
    } else {
      // Activate the profile
      applyProfile(profileId);
      setActiveProfile(profileId);
    }
  };

  return (
    <div className="py-4 px-5 space-y-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{translations.accessibilityProfiles.toUpperCase()}</h3>
        <button 
          className="text-xs text-gray-500 hover:text-gray-700 underline"
          onClick={(e) => {
            e.stopPropagation();
            resetSettings();
            setActiveProfile(null);
            setSelectedProfile(null);
          }}
          aria-label={translations.resetAllSettings}
        >
          {translations.reset || "Reset"}
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 pb-4">
        {accessibilityProfiles.map((profile) => {
          const isActive = activeProfile === profile.id;
          
          return (
            <div 
              key={profile.id}
              className={`relative border rounded-lg p-3 cursor-pointer transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 text-gray-800 border-gray-200 hover:border-gray-300 hover:bg-gray-200'
              }`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                handleProfileClick(profile.id);
              }}
              tabIndex={0}
              role="button"
              aria-label={`Apply ${profile.title} profile`}
              aria-pressed={isActive}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.stopPropagation(); // Prevent event from bubbling up
                  handleProfileClick(profile.id);
                  e.preventDefault();
                }
              }}
            >
              {isActive && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-md w-6 h-6 flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
              )}
              <div className={`w-full h-20 rounded mb-2 flex items-center justify-center ${
                isActive ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                {profile.icon(isActive ? 'text-white' : 'text-gray-800')}
              </div>
              <h4 className={`text-sm font-medium ${
                isActive ? 'text-white' : 'text-gray-800'
              }`}>{translations[profile.id]}</h4>
            </div>
          );
        })}
      </div>
    </div>
  );
}
