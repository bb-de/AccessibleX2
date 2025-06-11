import React from 'react';
import { useAccessibility } from '@/hooks/useAccessibility';
import { ChevronDown } from 'lucide-react';
import { Language } from '@/contexts/AccessibilityContext';

// Flag components for each language
const FlagUK = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-3 mr-2" viewBox="0 0 60 30">
    <clipPath id="a"><path d="M0 0v30h60V0z"/></clipPath>
    <clipPath id="b"><path d="M30 15h30v15zv15H0zH0V0zV0h30z"/></clipPath>
    <g clipPath="url(#a)">
      <path d="M0 0v30h60V0z" fill="#012169"/>
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6"/>
      <path d="M0 0l60 30m0-30L0 30" clipPath="url(#b)" stroke="#C8102E" strokeWidth="4"/>
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/>
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6"/>
    </g>
  </svg>
);

const FlagDE = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-3 mr-2" viewBox="0 0 5 3">
    <rect width="5" height="1" fill="#000000" />
    <rect width="5" height="1" y="1" fill="#FF0000" />
    <rect width="5" height="1" y="2" fill="#FFCC00" />
  </svg>
);

const FlagFR = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-3 mr-2" viewBox="0 0 3 2">
    <rect width="3" height="2" fill="#fff"/>
    <rect width="1" height="2" fill="#002395"/>
    <rect width="1" height="2" x="2" fill="#ED2939"/>
  </svg>
);

const FlagES = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-3 mr-2" viewBox="0 0 3 2">
    <rect width="3" height="2" fill="#c60b1e"/>
    <rect width="3" height="1" y="0.5" fill="#ffc400"/>
  </svg>
);

export function LanguageSelector() {
  const { language, setLanguage } = useAccessibility();
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Map languages to their display components
  const languageOptions: { value: Language; label: string; flag: React.ReactNode }[] = [
    { value: 'en', label: 'English', flag: <FlagUK /> },
    { value: 'de', label: 'Deutsch', flag: <FlagDE /> },
    { value: 'fr', label: 'Français', flag: <FlagFR /> },
    { value: 'es', label: 'Español', flag: <FlagES /> }
  ];
  
  // Get current language option
  const currentOption = languageOptions.find(option => option.value === language) || languageOptions[0];
  
  // Handle language selection
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center w-32 h-8 px-2 py-1 text-xs text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        aria-label={`Select language, current: ${currentOption.label}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {currentOption.flag}
        <span>{currentOption.label}</span>
        <ChevronDown className="w-4 h-4 ml-auto" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 z-10 w-32 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          <ul className="py-1" role="listbox" aria-label="Select language">
            {languageOptions.map(option => (
              <li key={option.value} role="option" aria-selected={language === option.value}>
                <button
                  onClick={() => handleSelectLanguage(option.value)}
                  className={`flex items-center w-full px-3 py-1.5 text-xs text-left ${
                    language === option.value ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  {option.flag}
                  <span>{option.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}