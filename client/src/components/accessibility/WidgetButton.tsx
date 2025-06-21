import React from 'react';
import widgetButtonLogo from '@/assets/widget-button-logo.png';
import { useDeviceDetection } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface WidgetButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function WidgetButton({ onClick, isOpen }: WidgetButtonProps) {
  const { isMobile } = useDeviceDetection();

  return (
    <div className={cn("fixed z-[9999]", 
      isMobile ? "bottom-3 right-3" : "bottom-4 right-4"
    )}>
      <button
        id="accessibility-toggle"
        aria-label={isOpen ? "Schließe Barrierefreiheitsmenü" : "Öffne Barrierefreiheitsmenü"}
        aria-expanded={isOpen}
        className={cn(
          "rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
          isMobile ? "w-12 h-12" : "w-16 h-16"
        )}
        onClick={onClick}
        style={{ padding: 0 }}
      >
        <img 
          src={widgetButtonLogo} 
          alt="Barrierefreiheit" 
          className="w-full h-full"
          style={{ borderRadius: '50%' }}
        />
      </button>
    </div>
  );
}
