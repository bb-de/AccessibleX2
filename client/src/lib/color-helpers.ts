import { ColorOption } from '@/contexts/AccessibilityContext';

// Color mapping für die Farboptionen
export const colorMap = {
  blue: { bg: '#0077cc', text: '#ffffff' },
  purple: { bg: '#8e44ad', text: '#ffffff' },
  red: { bg: '#e74c3c', text: '#ffffff' },
  orange: { bg: '#e67e22', text: '#ffffff' },
  teal: { bg: '#16a085', text: '#ffffff' },
  green: { bg: '#558b2f', text: '#ffffff' },
  white: { bg: '#ffffff', text: '#000000' },
  black: { bg: '#000000', text: '#ffffff' },
  default: { bg: 'initial', text: 'initial' }
};

// Funktion für benutzerdefinierte Textfarben
export function getTextColorStyles(colorOption: ColorOption): string {
  if (colorOption === 'default') return '';
  
  // Hier verwenden wir die direkte Farbe aus der colorMap für das gewählte Farbschema
  const color = colorOption === 'blue' ? '#0077cc' :
                colorOption === 'purple' ? '#8e44ad' :
                colorOption === 'red' ? '#e74c3c' :
                colorOption === 'orange' ? '#e67e22' :
                colorOption === 'teal' ? '#16a085' :
                colorOption === 'green' ? '#558b2f' : 
                colorOption === 'white' ? '#ffffff' :
                colorOption === 'black' ? '#000000' : 'initial';
  
  return `
    /* Apply custom text color to all text elements EXCEPT the widget */
    html body p:not([data-accessibility-widget="true"] p),
    html body span:not([data-accessibility-widget="true"] span),
    html body div:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] div),
    html body li:not([data-accessibility-widget="true"] li),
    html body label:not([data-accessibility-widget="true"] label) {
      color: ${color} !important;
    }
  `;
}

// Funktion für benutzerdefinierte Überschriftenfarben
export function getTitleColorStyles(colorOption: ColorOption): string {
  if (colorOption === 'default') return '';
  
  // Hier verwenden wir die direkte Farbe aus der colorMap für das gewählte Farbschema
  const color = colorOption === 'blue' ? '#0077cc' :
                colorOption === 'purple' ? '#8e44ad' :
                colorOption === 'red' ? '#e74c3c' :
                colorOption === 'orange' ? '#e67e22' :
                colorOption === 'teal' ? '#16a085' :
                colorOption === 'green' ? '#558b2f' : 
                colorOption === 'white' ? '#ffffff' :
                colorOption === 'black' ? '#000000' : 'initial';
  
  return `
    /* Apply custom title color to all heading elements EXCEPT the widget */
    html body h1:not([data-accessibility-widget="true"] h1),
    html body h2:not([data-accessibility-widget="true"] h2),
    html body h3:not([data-accessibility-widget="true"] h3),
    html body h4:not([data-accessibility-widget="true"] h4),
    html body h5:not([data-accessibility-widget="true"] h5),
    html body h6:not([data-accessibility-widget="true"] h6) {
      color: ${color} !important;
    }
  `;
}

// Funktion für benutzerdefinierte Hintergrundfarben
export function getBackgroundColorStyles(colorOption: ColorOption): string {
  if (colorOption === 'default') return '';
  
  const color = colorMap[colorOption]?.bg || 'initial';
  
  return `
    /* Apply custom background color to all elements EXCEPT the widget */
    html body *:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *) {
      background-color: ${color} !important;
    }
  `;
}