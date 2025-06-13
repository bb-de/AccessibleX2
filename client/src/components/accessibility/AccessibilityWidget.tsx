import React, { useEffect, useRef } from 'react';
import { WidgetButton } from './WidgetButton';
import { WidgetPanel } from './WidgetPanel';
import { useAccessibility } from '@/hooks/useAccessibility';

interface AccessibilityWidgetProps {
  shadowRootElement: ShadowRoot | null;
}

/**
 * Hauptkomponente des Accessibility-Widgets
 * Kombiniert den Button und das Panel mit dem gemeinsamen Zustand
 */
export function AccessibilityWidget({ shadowRootElement }: AccessibilityWidgetProps) {
  const { isOpen, toggleWidget, closeWidget } = useAccessibility();
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Event-Listener für Klicks außerhalb des Widgets
  useEffect(() => {
    console.log('useEffect in AccessibilityWidget ausgeführt. isOpen:', isOpen, 'shadowRootElement:', shadowRootElement);
    // Nur hinzufügen, wenn das Widget geöffnet ist
    if (!isOpen || !shadowRootElement) {
      console.log('Bedingung zum Anhängen des Listeners nicht erfüllt. isOpen:', isOpen, 'shadowRootElement:', shadowRootElement);
      return;
    }
    
    const handleClickOutside = (event: Event) => {
      if (!widgetRef.current) return;

      const path = event.composedPath();
      const isClickInsideWidget = path.some(node => node === widgetRef.current || (widgetRef.current && widgetRef.current.contains(node as Node)));
      const isClickOnToggleButton = (event.target as Element).closest('#accessibility-toggle');

      console.log('Klick-Ereignis:', event);
      console.log('Pfad des Ereignisses:', path);
      console.log('Ist Klick im Widget?', isClickInsideWidget);
      console.log('Ist Klick auf Umschalt-Button?', isClickOnToggleButton);

      if (!isClickInsideWidget && !isClickOnToggleButton) {
        console.log('Schließe Widget!');
        closeWidget();
      }
    };
    
    // Event-Listener zum Shadow Root hinzufügen
    shadowRootElement.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup beim Unmounten oder Ändern der Dependencies
    return () => {
      shadowRootElement.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeWidget, shadowRootElement]);
  
  return (
    <>
      <WidgetButton onClick={toggleWidget} isOpen={isOpen} />
      <div style={{ position: 'fixed', top: 0, left: 0 }}>
        <WidgetPanel isOpen={isOpen} ref={widgetRef} />
      </div>
    </>
  );
}