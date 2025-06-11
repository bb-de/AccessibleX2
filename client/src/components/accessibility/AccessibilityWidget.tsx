import React, { useEffect, useRef } from 'react';
import { WidgetButton } from './WidgetButton';
import { WidgetPanel } from './WidgetPanel';
import { useAccessibility } from '@/hooks/useAccessibility';

/**
 * Hauptkomponente des Accessibility-Widgets
 * Kombiniert den Button und das Panel mit dem gemeinsamen Zustand
 */
export function AccessibilityWidget() {
  const { isOpen, toggleWidget, closeWidget } = useAccessibility();
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Event-Listener für Klicks außerhalb des Widgets
  useEffect(() => {
    // Nur hinzufügen, wenn das Widget geöffnet ist
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      // Wenn das Widget-Ref existiert und der Klick außerhalb ist
      if (widgetRef.current && 
          !widgetRef.current.contains(event.target as Node) &&
          // Auch prüfen, ob es nicht der Button selbst ist
          !(event.target as Element).closest('#accessibility-toggle')) {
        closeWidget();
      }
    };
    
    // Event-Listener hinzufügen
    document.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup beim Unmounten oder Ändern der Dependencies
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeWidget]);
  
  return (
    <>
      <WidgetButton onClick={toggleWidget} isOpen={isOpen} />
      <div ref={widgetRef}>
        <WidgetPanel isOpen={isOpen} />
      </div>
    </>
  );
}