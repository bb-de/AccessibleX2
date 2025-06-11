import React from 'react';
import accessibleLogoImage from '@/assets/accessible-logo.png';

interface AccessibleLogoProps {
  className?: string;
  height?: number;
  width?: number;
}

export function AccessibleLogo({ className, height = 120, width = 540 }: AccessibleLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={accessibleLogoImage} 
        alt="Accessible Logo"
        style={{ 
          height: `${height}px`, 
          width: 'auto',
          maxWidth: `${width}px`
        }}
        className="object-contain"
      />
    </div>
  );
}