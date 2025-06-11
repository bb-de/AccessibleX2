import React from 'react';
import accessibleLogoImage from '@/assets/accessible-logo.png';

interface AccessibleLogoInlineProps {
  className?: string;
  height?: number;
}

export function AccessibleLogoInline({ className, height = 84 }: AccessibleLogoInlineProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <img 
        src={accessibleLogoImage} 
        alt="Accessible Logo"
        style={{ 
          height: `${height}px`, 
          width: 'auto'
        }}
        className="object-contain"
      />
    </div>
  );
}