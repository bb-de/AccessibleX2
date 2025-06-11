import { WidgetButton } from "./accessibility/WidgetButton";
import { WidgetPanel } from "./accessibility/WidgetPanel";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useEffect, useRef } from "react";

export function AccessibilityWidget() {
  const { isOpen, toggleWidget, closeWidget, language } = useAccessibility();
  const widgetRef = useRef<HTMLDivElement>(null);

  // Add click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        closeWidget();
      }
    };

    // Add event listener when widget is open
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeWidget]);

  return (
    <div 
      className="fixed z-[9999]" 
      data-accessibility-widget 
      data-lang={language} 
      ref={widgetRef}
      style={{ maxWidth: '400px', width: isOpen ? '400px' : 'auto' }}
    >
      <WidgetButton onClick={toggleWidget} isOpen={isOpen} />
      <WidgetPanel isOpen={isOpen} />
    </div>
  );
}
