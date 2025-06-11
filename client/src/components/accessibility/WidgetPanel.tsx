import { useState, useRef, useEffect } from "react";
import { ProfilesTab } from "./ProfilesTab";
import { VisionTab } from "./VisionTab";
import { ContentTab } from "./ContentTab";
import { NavigationTab } from "./NavigationTab";
import { WidgetFooter } from "./WidgetFooter";
import { LanguageSelector } from "./LanguageSelector";
import { AccessibleLogoInline } from "./AccessibleLogoInline";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  UserCog, 
  Eye, 
  FileText, 
  Compass, 
  RotateCcw,
  X
} from "lucide-react";

interface WidgetPanelProps {
  isOpen: boolean;
}

type TabType = "profiles" | "vision" | "content" | "navigation";

export function WidgetPanel({ isOpen }: WidgetPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profiles");
  const { toggleWidget, resetSettings, translations } = useAccessibility();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div 
      id="accessibility-panel" 
      className={`fixed top-4 right-4 bg-white rounded-xl shadow-lg transition-all duration-300 transform z-[9999] ${
        isOpen ? 'translate-y-0 opacity-100 visible' : 'translate-y-[-100%] opacity-0 invisible'
      }`}
      style={{
        width: '340px',
        minWidth: '340px',
        maxWidth: '340px',
        maxHeight: 'calc(100vh - 120px)', // Platz für Button unten lassen
        bottom: '80px', // Abstand vom Button
        overflowY: 'scroll',
        scrollBehavior: 'smooth'
      }}
      aria-hidden={!isOpen}
      onClick={(e) => e.stopPropagation()} // Prevent clicks inside the panel from closing it
    >
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AccessibleLogoInline className="mr-2" />
          </div>
          <div className="flex space-x-2">
            <button 
              id="reset-btn"
              aria-label={translations.resetAllSettings}
              className="text-sm text-gray-500 hover:text-gray-700 p-1 rounded flex items-center"
              onClick={resetSettings}
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              {translations.reset}
            </button>
            <button 
              id="close-panel-btn"
              aria-label={translations.closeAccessibilityMenu}
              className="text-gray-500 hover:text-gray-700 p-1 rounded flex items-center"
              onClick={toggleWidget}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Language Selector with Flags */}
        <div className="mt-3 flex justify-end">
          <LanguageSelector />
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg overflow-x-auto">
        <button 
          className={`flex-1 py-3 px-2 text-sm font-medium ${
            activeTab === "profiles" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("profiles")}
          aria-selected={activeTab === "profiles"}
        >
          <div className="flex flex-col items-center">
            <UserCog className="h-5 w-5 mb-1" />
            <span>{translations.profiles}</span>
          </div>
        </button>
        <button 
          className={`flex-1 py-3 px-2 text-sm font-medium ${
            activeTab === "vision" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("vision")}
          aria-selected={activeTab === "vision"}
        >
          <div className="flex flex-col items-center">
            <Eye className="h-5 w-5 mb-1" />
            <span>{translations.vision}</span>
          </div>
        </button>
        <button 
          className={`flex-1 py-3 px-2 text-sm font-medium ${
            activeTab === "content" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("content")}
          aria-selected={activeTab === "content"}
        >
          <div className="flex flex-col items-center">
            <FileText className="h-5 w-5 mb-1" />
            <span>{translations.content}</span>
          </div>
        </button>
        <button 
          className={`flex-1 py-3 px-2 text-sm font-medium ${
            activeTab === "navigation" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => handleTabChange("navigation")}
          aria-selected={activeTab === "navigation"}
        >
          <div className="flex flex-col items-center">
            <Compass className="h-5 w-5 mb-1" />
            <span>{translations.navigation}</span>
          </div>
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="overflow-y-visible">
        {activeTab === "profiles" && <ProfilesTab />}
        {activeTab === "vision" && <VisionTab />}
        {activeTab === "content" && <ContentTab />}
        {activeTab === "navigation" && <NavigationTab />}
      </div>
      
      {/* Panel Footer */}
      <WidgetFooter />
    </div>
  );
}

function AccessibilityIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}