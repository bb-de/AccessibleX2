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
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isClosing, setIsClosing] = React.useState(false);
  const closeTimeout = React.useRef<NodeJS.Timeout | null>(null);
  
  // Event-Listener für Klicks außerhalb des Widgets
  useEffect(() => {
    if (!(isOpen || isClosing)) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!widgetRef.current) return;
      const currentWidgetRef = widgetRef.current;
      const path = event.composedPath();
      const widgetContainer = shadowRootElement?.host;
      const isClickInsideWidgetOrToggleButton = path.some(node => 
        (node === currentWidgetRef) ||
        (node instanceof Node && currentWidgetRef.contains(node)) ||
        ((node instanceof Element) && node.id === 'accessibility-toggle') ||
        (node === widgetContainer)
      );
      const isClickInsideVirtualKeyboard = path.some(node => (node instanceof Element) && node.id === 'virtual-keyboard');
      if (isClickInsideVirtualKeyboard) {
        return; 
      }
      if (!isClickInsideWidgetOrToggleButton) {
        handleCloseWidget();
      }
    };
    document.body.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.body.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, isClosing, shadowRootElement, widgetRef, settings.virtualKeyboard]);

  // Reset isClosing wenn geöffnet
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
        closeTimeout.current = null;
      }
    }
    return () => {
      if (closeTimeout.current) {
        clearTimeout(closeTimeout.current);
      }
    };
  }, [isOpen]);

  const handleCloseWidget = React.useCallback(() => {
    if (!isClosing) {
      setIsClosing(true);
      closeTimeout.current = setTimeout(() => {
        toggleWidget();
      }, 300);
    }
  }, [isClosing, toggleWidget]);

  return (
    <AccessibilityProvider shadowRoot={shadowRootElement}>
      {/* Widget Button - Always fixed at bottom-5 right-5 */}
      <div className="fixed bottom-5 right-5 z-[9999]">
        <WidgetButton onClick={isOpen ? handleCloseWidget : toggleWidget} isOpen={isOpen || isClosing} />
      </div>
      
      {/* Widget Panel - Position adjusted dynamically */}
      <WidgetPanel isOpen={isOpen} isClosing={isClosing} handleCloseWidget={handleCloseWidget} ref={widgetRef} />
    </AccessibilityProvider>
  );
}