import React, { useEffect, useRef } from 'react';
import { WidgetButton } from './WidgetButton';
import { WidgetPanel } from './WidgetPanel';
import { useAccessibility } from '@/hooks/useAccessibility';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';

interface AccessibilityWidgetProps {
  shadowRootElement: ShadowRoot | null;
}

/**
 * Hauptkomponente des Accessibility-Widgets
 * Kombiniert den Button und das Panel mit dem gemeinsamen Zustand
 */
export function AccessibilityWidget({ shadowRootElement }: AccessibilityWidgetProps) {
  const { isOpen, toggleWidget, closeWidget } = useAccessibility();
  console.log('AccessibilityWidget render. isOpen:', isOpen, 'shadowRootElement:', shadowRootElement);
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
      const isClickInsideWidget = path.some(node => node === widgetRef.current || (widgetRef.current && node instanceof Node && widgetRef.current.contains(node)));
      const isClickOnToggleButton = (event.target as Element).closest('#accessibility-toggle');
      // Überprüfen, ob der Klick innerhalb der virtuellen Tastatur erfolgte
      const isClickInsideVirtualKeyboard = path.some(node => (node instanceof Element) && node.id === 'virtual-keyboard');

      console.log('Klick-Ereignis:', event);
      console.log('Pfad des Ereignisses:', path);
      console.log('Ist Klick im Widget?', isClickInsideWidget);
      console.log('Ist Klick auf Umschalt-Button?', !!isClickOnToggleButton); // Als Boolean für klarere Logs
      console.log('Ist Klick in virtueller Tastatur?', isClickInsideVirtualKeyboard); // Direkte Ausgabe des Boolean-Ergebnisses

      if (isClickInsideVirtualKeyboard) {
        console.log('Klick in virtueller Tastatur erkannt, schließe Widget NICHT.');
        return; // Nichts tun, wenn der Klick innerhalb der virtuellen Tastatur erfolgte
      }

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
    <AccessibilityProvider shadowRoot={shadowRootElement}>
      {/* Widget Button - Always fixed at bottom-5 right-5 */}
      <div className="fixed bottom-5 right-5 z-[9999]">
        <WidgetButton onClick={toggleWidget} isOpen={isOpen} />
      </div>
      
      {/* Widget Panel - Position adjusted dynamically */}
      <WidgetPanel isOpen={isOpen} ref={widgetRef} />
    </AccessibilityProvider>
  );
}