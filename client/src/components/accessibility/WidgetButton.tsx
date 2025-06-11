import React from 'react';
import widgetButtonLogo from '@/assets/widget-button-logo.png';

interface WidgetButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function WidgetButton({ onClick, isOpen }: WidgetButtonProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        id="accessibility-toggle"
        aria-label={isOpen ? "Close accessibility menu" : "Open accessibility menu"}
        aria-expanded={isOpen}
        className="rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        onClick={onClick}
        style={{ padding: 0 }}
      >
        <img 
          src={widgetButtonLogo} 
          alt="Accessibility" 
          className="w-full h-full"
          style={{ borderRadius: '50%' }}
        />
      </button>
    </div>
  );
}
