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
    // Nur hinzufügen, wenn das Widget geöffnet ist
    if (!isOpen || !shadowRootElement) return;
    
    const handleClickOutside = (event: Event) => {
      if (!widgetRef.current) return; // Sicherstellen, dass die Referenz verfügbar ist

      // Überprüfen, ob der Klick auf das Widget-Panel selbst oder einen seiner Nachfahren im zusammengesetzten Pfad erfolgte
      const isClickInsideWidget = event.composedPath().some(node => node === widgetRef.current || (widgetRef.current && widgetRef.current.contains(node as Node)));

      // Überprüfen, ob der Klick auf den Umschalt-Button erfolgte
      const isClickOnToggleButton = (event.target as Element).closest('#accessibility-toggle');

      if (!isClickInsideWidget && !isClickOnToggleButton) {
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