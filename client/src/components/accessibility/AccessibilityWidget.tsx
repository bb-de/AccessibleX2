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
  const { isOpen, toggleWidget, settings } = useAccessibility();
  console.log('AccessibilityWidget render. isOpen:', isOpen, 'shadowRootElement:', shadowRootElement, 'settings.virtualKeyboard:', settings.virtualKeyboard);
  const widgetRef = useRef<HTMLDivElement>(null);
  
  // Event-Listener für Klicks außerhalb des Widgets
  useEffect(() => {
    console.log('useEffect in AccessibilityWidget ausgeführt. isOpen:', isOpen, 'shadowRootElement:', shadowRootElement, 'settings.virtualKeyboard:', settings.virtualKeyboard);
    // Nur hinzufügen, wenn das Widget geöffnet ist
    if (!isOpen) {
      console.log('Bedingung zum Anhängen des Listeners nicht erfüllt. isOpen:', isOpen);
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!widgetRef.current) return;
      const currentWidgetRef = widgetRef.current;

      const path = event.composedPath();
      const widgetContainer = shadowRootElement?.host;

      // Überprüfen, ob der Klick innerhalb des Widget-Containers (Shadow Host) erfolgte
      // Oder innerhalb des Panels oder des Toggle-Buttons, die sich im Shadow DOM befinden
      const isClickInsideWidgetOrToggleButton = path.some(node => 
        (node === currentWidgetRef) ||
        (node instanceof Node && currentWidgetRef.contains(node)) ||
        ((node instanceof Element) && node.id === 'accessibility-toggle') ||
        (node === widgetContainer)
      );
      
      // Überprüfen, ob der Klick innerhalb der virtuellen Tastatur erfolgte (diese ist im Haupt-DOM)
      const isClickInsideVirtualKeyboard = path.some(node => (node instanceof Element) && node.id === 'virtual-keyboard');

      console.log('Klick-Ereignis:', event);
      console.log('Pfad des Ereignisses:', path);
      console.log('Ist Klick im Widget oder auf Toggle-Button?', isClickInsideWidgetOrToggleButton);
      console.log('Ist Klick in virtueller Tastatur?', isClickInsideVirtualKeyboard);

      if (isClickInsideVirtualKeyboard) {
        console.log('Klick in virtueller Tastatur erkannt, schließe Widget NICHT.');
        return; 
      }

      if (!isClickInsideWidgetOrToggleButton) {
        console.log('Schließe Widget!');
        toggleWidget();
      }
    };
    
    // Event-Listener zum gesamten Dokument hinzufügen, um Klicks überall zu erfassen
    document.body.addEventListener('mousedown', handleClickOutside);
    
    // Cleanup beim Unmounten oder Ändern der Dependencies
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleWidget, shadowRootElement, widgetRef, settings.virtualKeyboard]);
  
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