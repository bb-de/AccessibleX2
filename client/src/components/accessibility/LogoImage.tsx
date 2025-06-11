import React from 'react';

interface LogoImageProps {
  className?: string;
  width?: number;
  height?: number;
}

export function LogoImage({ className, width = 150, height = 40 }: LogoImageProps) {
  return (
    <div className={className} style={{ width, height }}>
      <img 
        src="/attached_assets/PluginVV.png" 
        alt="Accessible Logo" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'contain'
        }} 
      />
    </div>
  );
}