import { useContext } from 'react';
import { AccessibilityContext } from '@/contexts/AccessibilityContext';

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  
  return context;
}
