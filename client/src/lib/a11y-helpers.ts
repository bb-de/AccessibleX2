// Copyright (c) 2024 brandingbrothers.de. All rights reserved.
import { AccessibilitySettings } from '@/contexts/AccessibilityContext';
import { getTextColorStyles, getTitleColorStyles, getBackgroundColorStyles } from './color-helpers';
import { isTouchDevice } from './device-detection';

// Global variable to store the last active input element
let _lastActiveInput: HTMLInputElement | HTMLTextAreaElement | null = null;
let _focusListener: ((event: FocusEvent) => void) | null = null;

// Konstanten für die Seitenstruktur
const PAGE_STRUCTURE_CONSTANTS = {
  PANEL_ID: 'page-structure-panel',
  PANEL_WIDTH: '320px',
  Z_INDEX: '9999',
  ANIMATION_DURATION: '300ms'
};

// Helper function to enable keyboard navigation
function enableKeyboardNavigation(): void {
  // Create a container for keyboard navigation helpers
  const navHelper = document.createElement('div');
  navHelper.id = 'keyboard-nav-helpers';
  navHelper.style.position = 'fixed';
  navHelper.style.bottom = '20px';
  navHelper.style.right = '380px';
  navHelper.style.left = 'auto';
  navHelper.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  navHelper.style.color = 'white';
  navHelper.style.padding = '15px';
  navHelper.style.borderRadius = '8px';
  navHelper.style.zIndex = '9999';
  navHelper.style.maxWidth = '300px';
  navHelper.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';

  // Add keyboard navigation instructions
  navHelper.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 8px; font-size: 14px;">Keyboard Navigation</div>
    <ul style="margin: 0; padding-left: 15px; font-size: 13px; list-style-type: disc;">
      <li style="margin-bottom: 5px;">Press <kbd style="background: #eee; padding: 2px 4px; border-radius: 3px; color: #333;">Tab</kbd> to navigate between elements</li>
      <li style="margin-bottom: 5px;">Press <kbd style="background: #eee; padding: 2px 4px; border-radius: 3px; color: #333;">Enter</kbd> to activate buttons or links</li>
      <li style="margin-bottom: 5px;">Press <kbd style="background: #eee; padding: 2px 4px; border-radius: 3px; color: #333;">Esc</kbd> to close dialogs</li>
      <li style="margin-bottom: 5px;">Use <kbd style="background: #eee; padding: 2px 4px; border-radius: 3px; color: #333;">↑ ↓ ← →</kbd> for navigation in certain elements</li>
    </ul>
    <button id="close-keyboard-nav" style="margin-top: 10px; padding: 5px 10px; background: #fff; color: #000; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">Close</button>
  `;

  document.body.appendChild(navHelper);

  // Add tab index to interactive elements if they don't have one
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
  interactiveElements.forEach(element => {
    if (!element.hasAttribute('tabindex') && !element.closest('[data-accessibility-widget]')) {
      element.setAttribute('tabindex', '0');
    }
  });

  // Add close button event listener (IMMER im navHelper suchen!)
  const closeButton = navHelper.querySelector('#close-keyboard-nav');
  if (closeButton) {
    closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      disableKeyboardNavigation();
    });
  }

  // Add keyboard listener for enhanced keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// Helper function to handle keyboard navigation events
function handleKeyboardNavigation(e: KeyboardEvent): void {
  // Focus indicator - Add a more visible focus indicator when tab is used
  if (e.key === 'Tab') {
    // Add a class to the body to indicate keyboard navigation mode
    document.body.classList.add('keyboard-nav-mode');
  }

  // Escape key should close dialogs and menus
  if (e.key === 'Escape') {
    // Close modals and dialogs that are open
    const modals = document.querySelectorAll('[role="dialog"], [role="alertdialog"]');
    modals.forEach(modal => {
      if (modal instanceof HTMLElement) {
        modal.style.display = 'none';
      }
    });
  }
}

// Helper function to disable keyboard navigation
function disableKeyboardNavigation(): void {
  const navHelper = document.getElementById('keyboard-nav-helpers');
  if (navHelper) {
    navHelper.remove();
  }

  // Remove the keyboard navigation mode class from body
  document.body.classList.remove('keyboard-nav-mode');

  // Remove event listener
  document.removeEventListener('keydown', handleKeyboardNavigation);

  // Dispatch custom event, damit React den State zurücksetzen kann
  const event = new CustomEvent('accessibility:keyboard-navigation-closed');
  document.dispatchEvent(event);
}

// Helper function to show virtual keyboard
function showVirtualKeyboard(shadowRoot: ShadowRoot | null | undefined): void {
  // Store the currently active element if it's an input or textarea
  const currentActiveElementOnShow = getActiveElement(document);
  if (currentActiveElementOnShow instanceof HTMLInputElement || currentActiveElementOnShow instanceof HTMLTextAreaElement) {
    _lastActiveInput = currentActiveElementOnShow;
  } else {
    // Do NOT set to null here. We rely on the focusin listener to find the correct input.
  }

  // Add a focus listener to update _lastActiveInput dynamically
  if (!_focusListener) {
    _focusListener = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        _lastActiveInput = target;
      }
    };
    document.addEventListener('focusin', _focusListener, { capture: true });
  }

  // Create a keyboard container
  const keyboard = document.createElement('div') as HTMLElement;
  keyboard.id = 'virtual-keyboard';
  keyboard.style.position = 'fixed';
  keyboard.style.bottom = '80px'; // Adjusted to be above the widget button
  keyboard.style.left = '50%'; // Center horizontally
  keyboard.style.transform = 'translateX(-50%)'; // Center horizontally
  keyboard.style.width = 'fit-content'; // Make it fit content
  keyboard.style.maxWidth = '600px'; // Limit maximum width
  keyboard.style.padding = '10px';
  keyboard.style.backgroundColor = '#f0f0f0';
  keyboard.style.boxShadow = '0 -2px 10px rgba(0, 0, 0, 0.2)';
  keyboard.style.zIndex = '99998';
  keyboard.style.textAlign = 'center';
  keyboard.style.borderTop = '1px solid #ccc';

  // Define keyboard layout
  const keyboardRows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Backspace'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?'],
    ['Space']
  ];

  // Add close button
  const closeBar = document.createElement('div') as HTMLElement;
  closeBar.style.display = 'flex';
  closeBar.style.justifyContent = 'space-between';
  closeBar.style.alignItems = 'center';
  closeBar.style.marginBottom = '10px';

  const keyboardTitle = document.createElement('span') as HTMLElement;
  keyboardTitle.textContent = 'Virtual Keyboard';
  keyboardTitle.style.fontWeight = 'bold';
  keyboardTitle.style.fontSize = '14px';

  const closeButton = document.createElement('button') as HTMLButtonElement;
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', 'Close virtual keyboard');
  closeButton.style.backgroundColor = '#e0e0e0';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '50%';
  closeButton.style.width = '24px';
  closeButton.style.height = '24px';
  closeButton.style.fontSize = '16px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.display = 'flex';
  closeButton.style.alignItems = 'center';
  closeButton.style.justifyContent = 'center';
  closeButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent event from bubbling up
    event.preventDefault(); // Prevent any default browser action
    hideVirtualKeyboard(shadowRoot);
  });

  closeBar.appendChild(keyboardTitle);
  closeBar.appendChild(closeButton);
  keyboard.appendChild(closeBar);

  // Create keyboard layout
  keyboardRows.forEach(row => {
    const rowElement = document.createElement('div') as HTMLElement;
    rowElement.style.display = 'flex';
    rowElement.style.justifyContent = 'center';
    rowElement.style.margin = '5px 0';

    row.forEach(key => {
      const keyButton = document.createElement('button') as HTMLButtonElement;
      keyButton.textContent = key;
      keyButton.style.margin = '2px';
      keyButton.style.minWidth = key === 'Space' ? '200px' : key === 'Backspace' || key === 'Shift' ? '80px' : '40px';
      keyButton.style.height = '40px';
      keyButton.style.backgroundColor = '#f0f0f0 !important';
      keyButton.style.border = '1px solid #ccc !important';
      keyButton.style.borderRadius = '4px !important';
      keyButton.style.cursor = 'pointer !important';
      keyButton.style.fontSize = '16px !important';
      keyButton.style.color = '#000 !important';
      keyButton.style.display = 'flex !important';
      keyButton.style.alignItems = 'center !important';
      keyButton.style.justifyContent = 'center !important';
      keyButton.tabIndex = -1; // Prevent buttons from taking focus

      // Add key press functionality
      keyButton.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent button from stealing focus
        if (key === 'Space') {
          insertTextAtCursor(' ');
        } else if (key === 'Backspace') {
          deleteTextAtCursor();
        } else if (key === 'Shift') {
          toggleShift();
        } else {
          insertTextAtCursor(key);
        }
      });

      rowElement.appendChild(keyButton);
    });

    keyboard.appendChild(rowElement);
  });

  // Inject aggressive CSS for virtual keyboard buttons directly into shadowRoot
  const keyboardStyle = document.createElement('style');
  keyboardStyle.textContent = `
    #virtual-keyboard button {
      color: blue !important;
      font-size: 20px !important;
      opacity: 1 !important;
      background-color: lightblue !important;
    }
    #virtual-keyboard #close-keyboard-nav {
      color: initial !important;
      font-size: initial !important;
      background-color: initial !important;
    }
  `;
  if (shadowRoot) {
    shadowRoot.appendChild(keyboardStyle);
  } else {
    document.head.appendChild(keyboardStyle);
  }

  // Add to the document or shadow DOM
  if (shadowRoot) {
    shadowRoot.appendChild(keyboard);
  } else {
    document.body.appendChild(keyboard);
  }

  // Explicitly focus on the last active input if it exists
  if (_lastActiveInput) {
    _lastActiveInput.focus();
    // Re-set selection range to ensure cursor is at the end or where it was
    const val = _lastActiveInput.value;
    _lastActiveInput.selectionStart = _lastActiveInput.selectionEnd = val.length;
  }

  // Shift state
  let shiftEnabled = false;

  // Toggle shift key
  function toggleShift() {
    shiftEnabled = !shiftEnabled;

    // Update all letter keys
    const letterKeys = keyboard.querySelectorAll('button');
    letterKeys.forEach(button => {
      const keyText = (button as HTMLButtonElement).textContent;
      if (keyText && keyText.length === 1 && /[a-z]/.test(keyText)) {
        (button as HTMLButtonElement).textContent = shiftEnabled ? keyText.toUpperCase() : keyText.toLowerCase();
      }
    });
  }

  // Helper function to get the currently focused element, even if it's inside a shadow DOM
  function getActiveElement(root: Document | ShadowRoot = document): Element | null {
    const activeElement = root.activeElement;
    if (!activeElement || !activeElement.shadowRoot) {
      return activeElement;
    }
    return getActiveElement(activeElement.shadowRoot);
  }

  // Insert text at cursor position
  function insertTextAtCursor(text: string) {
    const activeElement = _lastActiveInput;

    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;

      activeElement.value = value.substring(0, start) + (shiftEnabled && text.length === 1 ? text.toUpperCase() : text) + value.substring(end);

      // Set cursor position after inserted text
      activeElement.selectionStart = activeElement.selectionEnd = start + 1;

      // Trigger input event for form validation
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    }
  }

  // Delete text at cursor position
  function deleteTextAtCursor() {
    const activeElement = _lastActiveInput;

    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;

      if (start === end && start > 0) {
        // No selection, delete character before cursor
        activeElement.value = value.substring(0, start - 1) + value.substring(end);
        activeElement.selectionStart = activeElement.selectionEnd = start - 1;
      } else if (start !== end) {
        // Delete selected text
        activeElement.value = value.substring(0, start) + value.substring(end);
        activeElement.selectionStart = activeElement.selectionEnd = start;
      }

      // Trigger input event for form validation
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
    }
  }
}

// Helper function to hide virtual keyboard
function hideVirtualKeyboard(currentShadowRoot: ShadowRoot | null | undefined): void {
  let keyboard: HTMLElement | null = null;

  if (currentShadowRoot) {
    keyboard = currentShadowRoot.getElementById('virtual-keyboard');
  }

  // If not found in currentShadowRoot or no currentShadowRoot, check document body
  if (!keyboard) {
    keyboard = document.body.querySelector('#virtual-keyboard');
  }

  if (keyboard) {
    keyboard.remove();

    // Remove focus listener when keyboard is hidden
    if (_focusListener) {
      document.removeEventListener('focusin', _focusListener, { capture: true });
      _focusListener = null;
    }

    // Reset virtual keyboard setting
    const event = new CustomEvent('accessibility:virtual-keyboard-closed');
    document.dispatchEvent(event);
  }
}

// Hilfsfunktion zum Erstellen des Seitenstruktur-Panels
function createPageStructurePanel(): HTMLElement {
  const panel = document.createElement('div');
  panel.id = PAGE_STRUCTURE_CONSTANTS.PANEL_ID;
  
  // Basis-Styling
  Object.assign(panel.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    height: '100vh',
    width: PAGE_STRUCTURE_CONSTANTS.PANEL_WIDTH,
    backgroundColor: 'white',
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    zIndex: PAGE_STRUCTURE_CONSTANTS.Z_INDEX,
    overflowY: 'auto',
    transition: `transform ${PAGE_STRUCTURE_CONSTANTS.ANIMATION_DURATION} ease-in-out`,
    transform: 'translateX(-100%)'
  });

  // Header
  const header = document.createElement('div');
  Object.assign(header.style, {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });

  const title = document.createElement('h2');
  title.textContent = 'Seitenstruktur';
  title.style.margin = '0';
  title.style.fontSize = '1.25rem';
  title.style.fontWeight = '600';

  const closeButton = document.createElement('button');
  closeButton.innerHTML = '×';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '1.5rem';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0.5rem';
  closeButton.setAttribute('aria-label', 'Schließen');
  closeButton.onclick = () => {
    const event = new CustomEvent('accessibility:page-structure-closed');
    document.dispatchEvent(event);
  };

  header.appendChild(title);
  header.appendChild(closeButton);
  panel.appendChild(header);

  // Content Container
  const content = document.createElement('div');
  content.style.padding = '1rem';
  panel.appendChild(content);

  return panel;
}

// Hilfsfunktion zum Analysieren der Seitenstruktur
function analyzePageStructure(): HTMLElement[] {
  const elements: HTMLElement[] = [];
  const importantElements = document.querySelectorAll('header, nav, main, section, article, aside, footer, h1, h2, h3, h4, h5, h6');
  
  importantElements.forEach((element) => {
    if (element instanceof HTMLElement) {
      elements.push(element);
    }
  });

  return elements;
}

// Hilfsfunktion zum Erstellen der Strukturansicht
function createStructureView(elements: HTMLElement[]): HTMLElement {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '0.5rem';

  elements.forEach((element) => {
    const item = document.createElement('div');
    item.style.padding = '0.5rem';
    item.style.border = '1px solid #e5e7eb';
    item.style.borderRadius = '0.25rem';
    item.style.cursor = 'pointer';
    item.style.transition = 'background-color 0.2s';

    const tagName = element.tagName.toLowerCase();
    const text = element.textContent?.trim() || '';
    const role = element.getAttribute('role') || '';
    
    item.innerHTML = `
      <div style="font-weight: 600; color: #4b5563;">${tagName}</div>
      ${text ? `<div style="color: #6b7280; font-size: 0.875rem;">${text.substring(0, 50)}${text.length > 50 ? '...' : ''}</div>` : ''}
      ${role ? `<div style="color: #9ca3af; font-size: 0.75rem;">Role: ${role}</div>` : ''}
    `;

    item.onclick = () => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.style.outline = '2px solid #3b82f6';
      setTimeout(() => {
        element.style.outline = 'none';
      }, 2000);
    };

    item.onmouseover = () => {
      item.style.backgroundColor = '#f3f4f6';
    };

    item.onmouseout = () => {
      item.style.backgroundColor = 'transparent';
    };

    container.appendChild(item);
  });

  return container;
}

function showPageStructure(): void {
  try {
    // Entferne existierendes Panel falls vorhanden
    hidePageStructure();

    // Erstelle neues Panel
    const panel = createPageStructurePanel();
    document.body.appendChild(panel);

    // Analysiere Seitenstruktur
    const elements = analyzePageStructure();
    const structureView = createStructureView(elements);
    
    // Füge Strukturansicht zum Panel hinzu
    const content = panel.querySelector('div:last-child');
    if (content) {
      content.appendChild(structureView);
    }

    // Zeige Panel mit Animation
    requestAnimationFrame(() => {
      panel.style.transform = 'translateX(0)';
    });

    // Füge Escape-Key-Handler hinzu
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hidePageStructure();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

  } catch (error) {
    console.error('Fehler beim Anzeigen der Seitenstruktur:', error);
  }
}

function hidePageStructure(): void {
  try {
    const panel = document.getElementById(PAGE_STRUCTURE_CONSTANTS.PANEL_ID);
    if (panel) {
      // Animation zum Ausblenden
      panel.style.transform = 'translateX(-100%)';
      
      // Entferne Panel nach Animation
      setTimeout(() => {
        panel.remove();
      }, parseInt(PAGE_STRUCTURE_CONSTANTS.ANIMATION_DURATION));

      // Dispatch Event
      const event = new CustomEvent('accessibility:page-structure-closed');
      document.dispatchEvent(event);
    }
  } catch (error) {
    console.error('Fehler beim Ausblenden der Seitenstruktur:', error);
  }
}

// Helper function to handle custom cursor
function handleCustomCursor(settings: AccessibilitySettings): void {
  // Remove any existing custom cursors
  removeCustomCursor();

  // Create a new div for the custom cursor
  const cursorElement = document.createElement('div');
  cursorElement.id = 'custom-cursor';

  // Set size based on settings
  let cursorSize = '32'; // Default size in pixels (as string for SVG)
  if (settings.cursorSize === 'big') {
    cursorSize = '48';
  } else if (settings.cursorSize === 'bigger') {
    cursorSize = '64';
  } else if (settings.cursorSize === 'biggest') {
    cursorSize = '80';
  }

  // Set color based on settings
  let cursorColor = '#000000';
  if (settings.cursorColor === 'white') {
    cursorColor = '#ffffff';
  } else if (settings.cursorColor === 'black') {
    cursorColor = '#000000';
  } else if (settings.cursorColor === 'blue') {
    cursorColor = '#0000ff';
  } else if (settings.cursorColor === 'red') {
    cursorColor = '#ff0000';
  } else if (settings.cursorColor === 'green') {
    cursorColor = '#00ff00';
  } else if (settings.cursorColor === 'yellow') {
    cursorColor = '#ffff00';
  } else if (settings.cursorColor === 'purple') {
    cursorColor = '#800080';
  }

  // Create the SVG cursor with the selected color - using a simpler, solid arrow design
  const svgCursor = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" viewBox="0 0 50 50">
      <path fill="${cursorColor}" stroke="none" d="M 13 5 L 13 39 L 23 29 L 29 46 L 35 44 L 29 27 L 40 26 Z"></path>
    </svg>
  `;

  // Apply styles to the cursor element
  cursorElement.style.position = 'fixed';
  cursorElement.style.pointerEvents = 'none';
  cursorElement.style.zIndex = '999999';
  cursorElement.style.transform = 'none'; // Kein initialer transform, die Position wird von handleMouseMove gesetzt
  cursorElement.style.display = 'none';
  cursorElement.innerHTML = svgCursor;

  // Add to the document
  document.body.appendChild(cursorElement);

  // Add event listener to move custom cursor with mouse
  document.addEventListener('mousemove', handleMouseMove);
}

// Helper function to handle mouse movement for custom cursor
function handleMouseMove(e: MouseEvent): void {
  const customCursor = document.getElementById('custom-cursor');
  const customCursorDot = document.getElementById('custom-cursor-dot');

  if (customCursor) {
    const target = e.target as HTMLElement;
    const isOverWidget = target.closest('[data-accessibility-widget]');

    // Holen Sie die aktuelle Cursorgröße in Pixeln
    const cursorElementWidth = customCursor.offsetWidth;
    const cursorElementHeight = customCursor.offsetHeight;

    // Der Hotspot des SVG-Cursors ist bei (13, 5) im 50x50 ViewBox
    // Berechnen Sie den Offset relativ zur tatsächlichen Größe des SVG-Elements
    const offsetX = (13 / 50) * cursorElementWidth;
    const offsetY = (5 / 50) * cursorElementHeight;

    if (isOverWidget) {
      customCursor.style.display = 'none';
    } else {
      customCursor.style.display = 'block';
      customCursor.style.left = `${e.clientX - offsetX}px`;
      customCursor.style.top = `${e.clientY - offsetY}px`;
      customCursor.style.transform = 'none'; // Stellen Sie sicher, dass keine zusätzliche Transformation angewendet wird
    }

    if (customCursorDot) {
      customCursorDot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }
  }
}

// Helper function to remove custom cursor
function removeCustomCursor(): void {
  const customCursor = document.getElementById('custom-cursor');
  const customCursorDot = document.getElementById('custom-cursor-dot');
  if (customCursor) {
    customCursor.remove();
  }
  if (customCursorDot) {
    customCursorDot.remove();
  }
  document.removeEventListener('mousemove', handleMouseMove);
}

// ---- Touch & Mouse Event Normalization ----
function getEventCoordinates(e: MouseEvent | TouchEvent): { x: number, y: number } {
    if (e instanceof MouseEvent) {
      return { x: e.clientX, y: e.clientY };
    } else if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: -100, y: -100 }; // Default/fallback position
}

// Performance optimization: Throttle function
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: any[]) => {
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
}

// Mobile-optimized throttle (more aggressive for touch devices)
function mobileThrottle<T extends (...args: any[]) => void>(func: T, limit: number): T {
  let inThrottle: boolean;
  let lastArgs: any[] | null = null;
  
  return ((...args: any[]) => {
    lastArgs = args;
    
    if (!inThrottle) {
      func.apply(null, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        // Execute the last missed call
        if (lastArgs) {
          func.apply(null, lastArgs);
          lastArgs = null;
        }
      }, limit);
    }
  }) as T;
}

// ---- Reading Mask: Mouse and Touch Support ----
function handleReadingMask(): void {
  // Remove any existing reading mask first
  removeReadingMask();

  // Create mask elements
  const topMask = document.createElement('div');
  const bottomMask = document.createElement('div');
  const focusStrip = document.createElement('div');

  // Set IDs
  topMask.id = 'reading-mask-top';
  bottomMask.id = 'reading-mask-bottom';
  focusStrip.id = 'reading-mask-focus';

  // Set common styles with performance optimizations
  const commonStyles = {
    position: 'fixed',
    left: '0',
    width: '100%',
    pointerEvents: 'none',
    zIndex: '999999',
    willChange: 'transform', // Optimize for animations
    backfaceVisibility: 'hidden', // Reduce rendering cost
    transform: 'translateZ(0)' // Force hardware acceleration
  };

  // Apply styles to top mask
  Object.assign(topMask.style, commonStyles, {
    top: '0',
    height: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    transform: 'translateZ(0) translateY(0px)' // Use transform instead of height
  });

  // Apply styles to bottom mask
  Object.assign(bottomMask.style, commonStyles, {
    bottom: '0',
    height: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    transform: 'translateZ(0) translateY(0px)' // Use transform instead of height
  });

  // Apply styles to focus strip
  Object.assign(focusStrip.style, commonStyles, {
    height: '100px',
    border: '2px solid rgba(255, 255, 0, 0.5)',
    boxSizing: 'border-box',
    backgroundColor: 'transparent',
    transform: 'translateZ(0) translateY(0px)' // Use transform for positioning
  });

  // Add elements to the document
  document.body.appendChild(topMask);
  document.body.appendChild(bottomMask);
  document.body.appendChild(focusStrip);

  // Store current mouse/touch position globally
  if (!window.hasOwnProperty('lastKnownPosition')) {
    (window as any).lastKnownPosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    // Tracking function for position (runs only once)
    const updatePosition = (e: MouseEvent | TouchEvent) => {
      const { x, y } = getEventCoordinates(e);
      (window as any).lastKnownPosition = { x, y };
    };
    
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('touchmove', updatePosition, { passive: true });
  }

  // Use the last stored position for initial placement
  const cursorX = (window as any).lastKnownPosition.x;
  const cursorY = (window as any).lastKnownPosition.y;

  // Start with the current position
  const initialEvent = new MouseEvent('mousemove', {
    clientX: cursorX,
    clientY: cursorY,
    bubbles: true
  });
  updateReadingMask(initialEvent);

  // Use different throttle for mobile vs desktop
  const isMobile = isTouchDevice();
  const throttleDelay = isMobile ? 16 : 16; // 60fps on both mobile and desktop for modern devices
  const throttledUpdate = isMobile ? mobileThrottle(updateReadingMask, throttleDelay) : throttle(updateReadingMask, throttleDelay);
  
  document.addEventListener('mousemove', throttledUpdate);
  document.addEventListener('touchmove', throttledUpdate, { passive: true });
}

function updateReadingMask(e: MouseEvent | TouchEvent): void {
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    const topMask = document.getElementById('reading-mask-top');
    const bottomMask = document.getElementById('reading-mask-bottom');
    const focusStrip = document.getElementById('reading-mask-focus');

    if (topMask && bottomMask && focusStrip) {
      const focusHeight = 100; // Height of the focus strip
      const { y } = getEventCoordinates(e);
      const windowHeight = window.innerHeight;

      // Calculate positions
      const focusStripTop = y - focusHeight / 2;
      const topMaskHeight = Math.max(0, focusStripTop);
      const bottomMaskTop = Math.min(windowHeight, y + focusHeight / 2);
      const bottomMaskHeight = Math.max(0, windowHeight - bottomMaskTop);

      // Use transform instead of height/top for better performance
      topMask.style.transform = `translateZ(0) scaleY(${topMaskHeight / windowHeight})`;
      bottomMask.style.transform = `translateZ(0) translateY(${bottomMaskTop - windowHeight}px) scaleY(${bottomMaskHeight / windowHeight})`;
      focusStrip.style.transform = `translateZ(0) translateY(${focusStripTop}px)`;
    }
  });
}

function removeReadingMask(): void {
  const elementsToRemove = [
    'reading-mask-top',
    'reading-mask-bottom',
    'reading-mask-focus'
  ];

  elementsToRemove.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.remove();
  });

  // Remove event listeners
  document.removeEventListener('mousemove', updateReadingMask);
  document.removeEventListener('touchmove', updateReadingMask);
}

// ---- Reading Guide: Mouse and Touch Support ----
function handleReadingGuide(): void {
  // Remove any existing reading guide first
  removeReadingGuide();

  // Create guide element
  const guide = document.createElement('div');
  guide.id = 'reading-guide';

  // Apply styles with performance optimizations
  guide.style.position = 'fixed';
  guide.style.left = '0';
  guide.style.width = '100%';
  guide.style.height = '30px';
  guide.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
  guide.style.border = '1px solid rgba(255, 255, 0, 0.5)';
  guide.style.pointerEvents = 'none';
  guide.style.zIndex = '9999';
  guide.style.willChange = 'transform';
  guide.style.backfaceVisibility = 'hidden';
  guide.style.transform = 'translateZ(0) translateY(0px)';

  // Add to document
  document.body.appendChild(guide);

  // Use different throttle for mobile vs desktop
  const isMobile = isTouchDevice();
  const throttleDelay = isMobile ? 16 : 16; // 60fps on both mobile and desktop for modern devices
  const throttledUpdate = isMobile ? mobileThrottle(updateReadingGuide, throttleDelay) : throttle(updateReadingGuide, throttleDelay);
  
  document.addEventListener('mousemove', throttledUpdate);
  document.addEventListener('touchmove', throttledUpdate, { passive: true });
}

function updateReadingGuide(e: MouseEvent | TouchEvent): void {
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    const guide = document.getElementById('reading-guide');
    if (guide) {
      const { y } = getEventCoordinates(e);
      // Use transform instead of top for better performance
      guide.style.transform = `translateZ(0) translateY(${y}px)`;
    }
  });
}

function removeReadingGuide(): void {
  const guide = document.getElementById('reading-guide');
  if (guide) guide.remove();

  // Remove event listeners
  document.removeEventListener('mousemove', updateReadingGuide);
  document.removeEventListener('touchmove', updateReadingGuide);
}

// Helper function for contrast modes
function getContrastModeStyles(contrastMode: string): string {
  let styles = '';
  switch (contrastMode) {
    case 'increased':
      styles += `
        /* Apply increased contrast to all elements EXCEPT the widget */
        body *:not([data-accessibility-widget]):not([data-accessibility-widget] *):not(#accessibility-toggle):not(#accessibility-panel):not(#accessibility-panel *) {
          color: #000000 !important;
          background-color: #ffffff !important;
        }

        /* Make links and buttons distinct but exclude widget elements */
        a:not([data-accessibility-widget] a), 
        button:not([data-accessibility-widget] button), 
        [role="button"]:not([data-accessibility-widget] [role="button"]), 
        [role="link"]:not([data-accessibility-widget] [role="link"]) {
          color: #0000cc !important;
          background-color: #ffffff !important;
          text-decoration: underline !important;
        }

        /* Ensure headers stand out but exclude widget headers */
        h1:not([data-accessibility-widget] h1),
        h2:not([data-accessibility-widget] h2),
        h3:not([data-accessibility-widget] h3),
        h4:not([data-accessibility-widget] h4),
        h5:not([data-accessibility-widget] h5),
        h6:not([data-accessibility-widget] h6) {
          color: #000000 !important;
          background-color: #ffffff !important;
          font-weight: bold !important;
        }
      `;
      break;
    case 'high':
      styles += `
        /* Apply high contrast (weiße Schrift auf schwarzem Hintergrund) EXCEPT the widget */
        body *:not([data-accessibility-widget]):not([data-accessibility-widget] *):not(#accessibility-toggle):not(#accessibility-panel):not(#accessibility-panel *) {
          color: #ffffff !important;
          background-color: #000000 !important;
        }

        /* Make links and buttons distinct but exclude widget elements */
        a:not([data-accessibility-widget] a), 
        button:not([data-accessibility-widget] button), 
        [role="button"]:not([data-accessibility-widget] [role="button"]), 
        [role="link"]:not([data-accessibility-widget] [role="link"]) {
          color: #ffff00 !important;
          background-color: #000000 !important;
          text-decoration: underline !important;
        }

        /* Ensure headers stand out but exclude widget headers */
        h1:not([data-accessibility-widget] h1),
        h2:not([data-accessibility-widget] h2),
        h3:not([data-accessibility-widget] h3),
        h4:not([data-accessibility-widget] h4),
        h5:not([data-accessibility-widget] h5),
        h6:not([data-accessibility-widget] h6) {
          color: #ffffff !important;
          background-color: #000000 !important;
          font-weight: bold !important;
          border-bottom: 1px solid #ffffff !important;
        }
      `;
      break;
    case 'dark':
      styles += `
        /* Apply dark contrast (gelbe Schrift auf schwarzem Hintergrund) EXCEPT the widget */
        body *:not([data-accessibility-widget]):not([data-accessibility-widget] *):not(#accessibility-toggle):not(#accessibility-panel):not(#accessibility-panel *) {
          color: #ffff00 !important;
          background-color: #000000 !important;
        }

        /* Make links and buttons distinct but exclude widget elements */
        a:not([data-accessibility-widget] a), 
        button:not([data-accessibility-widget] button), 
        [role="button"]:not([data-accessibility-widget] [role="button"]), 
        [role="link"]:not([data-accessibility-widget] [role="link"]) {
          color: #ffff00 !important;
          background-color: #000000 !important;
          text-decoration: underline !important;
        }

        /* Ensure headers stand out but exclude widget headers */
        h1:not([data-accessibility-widget] h1),
        h2:not([data-accessibility-widget] h2),
        h3:not([data-accessibility-widget] h3),
        h4:not([data-accessibility-widget] h4),
        h5:not([data-accessibility-widget] h5),
        h6:not([data-accessibility-widget] h6) {
          color: #ffff00 !important;
          background-color: #000000 !important;
          font-weight: bold !important;
        }
      `;
      break;
    case 'light':
      styles += `
        /* Apply light sepia contrast to all elements EXCEPT the widget */
        body *:not([data-accessibility-widget]):not([data-accessibility-widget]*):not(#accessibility-toggle):not(#accessibility-panel):not(#accessibility-panel *) {
          color: #4b3621 !important;
          background-color: #f8f0dd !important;
        }

        /* Make links and buttons distinct but exclude widget elements */
        a:not([data-accessibility-widget] a), 
        button:not([data-accessibility-widget] button), 
        [role="button"]:not([data-accessibility-widget] [role="button"]), 
        [role="link"]:not([data-accessibility-widget] [role="link"]) {
          color: #0000cc !important;
          background-color: #f8f0dd !important;
          text-decoration: underline !important;
        }

        /* Ensure headers stand out but exclude widget headers */
        h1:not([data-accessibility-widget] h1),
        h2:not([data-accessibility-widget] h2),
        h3:not([data-accessibility-widget] h3),
        h4:not([data-accessibility-widget] h4),
        h5:not([data-accessibility-widget] h5),
        h6:not([data-accessibility-widget] h6) {
          color: #4b3621 !important;
          background-color: #f8f0dd !important;
          font-weight: bold !important;
        }
      `;
      break;
    case 'yellow-on-black':
      styles += `
        html, body, div, span, applet, object, iframe,
        /* Make links and buttons distinct but exclude widget elements */
        a:not([data-accessibility-widget] a), 
        button:not([data-accessibility-widget] button), 
        [role="button"]:not([data-accessibility-widget] [role="button"]), 
        [role="link"]:not([data-accessibility-widget] [role="link"]) {
          color: #ffff00 !important;
          background-color: #000000 !important;
          text-decoration: underline !important;
        }

        /* Ensure headers stand out but exclude widget headers */
        h1:not([data-accessibility-widget] h1),
        h2:not([data-accessibility-widget] h2),
        h3:not([data-accessibility-widget] h3),
        h4:not([data-accessibility-widget] h4),
        h5:not([data-accessibility-widget] h5),
        h6:not([data-accessibility-widget] h6) {
          color: #ffff00 !important;
          background-color: #000000 !important;
          font-weight: bold !important;
        }
      `;
      break;
    default:
      styles = '';
  }
  return styles;
}

// Helper function for font families
function getFontFamilyStyles(fontFamily: string): string {
  switch (fontFamily) {
    case 'readable':
      return `
        body, p, div, span, li, a, button, input, textarea, select {
          font-family: Arial, Helvetica, sans-serif !important;
        }
      `;
    case 'dyslexic':
      return `
        body, p, div, span, li, a, h1, h2, h3, h4, h5, h6, button, input, textarea, select {
          font-family: 'Comic Sans MS', 'Comic Sans', cursive !important;
          letter-spacing: 0.1em !important;
          word-spacing: 0.15em !important;
          line-height: 1.5 !important;
        }
      `;
    default:
      return '';
  }
}

// Hilfsfunktion: Prüft, ob die Seite hell ist
function isPageBright() {
  const bg = window.getComputedStyle(document.body).backgroundColor;
  const rgb = bg.match(/\d+/g);
  if (!rgb) return true; // Standard: hell
  const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
  return brightness > 180; // Schwellenwert: >180 = hell
}

// Selektiver Darkmode: Nur helle Hintergründe abdunkeln oder zurücksetzen
function applySelectiveDarkmode(active: boolean) {
  const allElements = document.querySelectorAll<HTMLElement>('body *');
  allElements.forEach(el => {
    if (active) {
      const bg = window.getComputedStyle(el).backgroundColor;
      const rgb = bg.match(/\d+/g);
      if (!rgb) return;
      const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
      if (brightness > 180) {
        el.style.backgroundColor = '#181818';
        el.style.color = '#f0f0f0';
      }
    } else {
      el.style.backgroundColor = '';
      el.style.color = '';
    }
  });
}

// Apply multiple style adjustments based on the active settings
export function applyAccessibilityStyles(settings: AccessibilitySettings, shadowRoot: ShadowRoot | null | undefined): void {
  const styleId = 'accessibility-styles';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;

  if (styleElement) {
    styleElement.remove();
  }

  styleElement = document.createElement('style');
  styleElement.id = styleId;

  let cssRules = '';

  // Vision settings
  cssRules += getContrastModeStyles(settings.contrastMode);

  // Always apply custom color adjustments, regardless of contrast mode
  cssRules += getTextColorStyles(settings.textColor);
  cssRules += getTitleColorStyles(settings.titleColor);
  cssRules += getBackgroundColorStyles(settings.backgroundColor);

  // Apply font family
  cssRules += getFontFamilyStyles(settings.fontFamily);

  // Apply text adjustments in 2% increments 
  if (settings.textSize !== 0) {
    // Positive increments only (2% per step, starting from 1)
    const adjustment = Math.max(0, settings.textSize) * 2;

    // Apply size increase only to site content (not widget)
    cssRules += `
      :root {
        --text-size-factor: ${adjustment}%;
      }

      /* Headings - maintain hierarchy but scale up */
      h1:not([data-accessibility-widget] h1) { font-size: calc(2em + var(--text-size-factor)) !important; }
      h2:not([data-accessibility-widget] h2) { font-size: calc(1.75em + var(--text-size-factor)) !important; }
      h3:not([data-accessibility-widget] h3) { font-size: calc(1.5em + var(--text-size-factor)) !important; }
      h4:not([data-accessibility-widget] h4) { font-size: calc(1.25em + var(--text-size-factor)) !important; }
      h5:not([data-accessibility-widget] h5) { font-size: calc(1.1em + var(--text-size-factor)) !important; }
      h6:not([data-accessibility-widget] h6) { font-size: calc(1em + var(--text-size-factor)) !important; }

      /* Other text elements */
      p:not([data-accessibility-widget] p),
      div:not([data-accessibility-widget]):not([data-accessibility-widget] div),
      span:not([data-accessibility-widget] span),
      li:not([data-accessibility-widget] li),
      a:not([data-accessibility-widget] a),
      button:not([data-accessibility-widget] button),
      input:not([data-accessibility-widget] input),
      textarea:not([data-accessibility-widget] textarea),
      select:not([data-accessibility-widget] select) {
        font-size: calc(1em + var(--text-size-factor)) !important;
      }
    `;
  }

  // Apply line height
  if (settings.lineHeight !== 0) {
    cssRules += `
      p:not([data-accessibility-widget] p),
      div:not([data-accessibility-widget]):not([data-accessibility-widget] div),
      span:not([data-accessibility-widget] span),
      li:not([data-accessibility-widget] li) {
        line-height: ${1.5 + (settings.lineHeight * 0.15)} !important;
      }
    `;
  }

  // Apply letter spacing
  if (settings.letterSpacing !== 0) {
    cssRules += `
      body:not([data-accessibility-widget]) p,
      body:not([data-accessibility-widget]) div,
      body:not([data-accessibility-widget]) span,
      body:not([data-accessibility-widget]) li,
      body:not([data-accessibility-widget]) a,
      body:not([data-accessibility-widget]) h1,
      body:not([data-accessibility-widget]) h2,
      body:not([data-accessibility-widget]) h3,
      body:not([data-accessibility-widget]) h4,
      body:not([data-accessibility-widget]) h5,
      body:not([data-accessibility-widget]) h6,
      body:not([data-accessibility-widget]) button,
      body:not([data-accessibility-widget]) input,
      body:not([data-accessibility-widget]) textarea,
      body:not([data-accessibility-widget]) select {
        letter-spacing: ${settings.letterSpacing * 0.05}em !important;
      }
    `;
  }

  // Apply word spacing
  if (settings.wordSpacing > 0) {
    cssRules += `
      body:not([data-accessibility-widget]) p,
      body:not([data-accessibility-widget]) div,
      body:not([data-accessibility-widget]) span,
      body:not([data-accessibility-widget]) li,
      body:not([data-accessibility-widget]) a,
      body:not([data-accessibility-widget]) h1,
      body:not([data-accessibility-widget]) h2,
      body:not([data-accessibility-widget]) h3,
      body:not([data-accessibility-widget]) h4,
      body:not([data-accessibility-widget]) h5,
      body:not([data-accessibility-widget]) h6,
      body:not([data-accessibility-widget]) button,
      body:not([data-accessibility-widget]) input,
      body:not([data-accessibility-widget]) textarea,
      body:not([data-accessibility-widget]) select {
        word-spacing: ${settings.wordSpacing * 0.05}em !important;
      }
    `;
  }

  // Apply text alignment
  if (settings.textAlign !== 'default') {
    let alignValue = 'left';

    if (settings.textAlign === 'center') {
      alignValue = 'center';
    } else if (settings.textAlign === 'right') {
      alignValue = 'right';
    }

    cssRules += `
      body:not([data-accessibility-widget]) p,
      body:not([data-accessibility-widget]) div,
      body:not([data-accessibility-widget]) li,
      body:not([data-accessibility-widget]) h1,
      body:not([data-accessibility-widget]) h2,
      body:not([data-accessibility-widget]) h3,
      body:not([data-accessibility-widget]) h4,
      body:not([data-accessibility-widget]) h5,
      body:not([data-accessibility-widget]) h6 {
        text-align: ${alignValue} !important;
      }
    `;
  }

  // Apply highlight titles
  if (settings.highlightTitles) {
    cssRules += `
      body:not([data-accessibility-widget]) h1,
      body:not([data-accessibility-widget]) h2,
      body:not([data-accessibility-widget]) h3,
      body:not([data-accessibility-widget]) h4,
      body:not([data-accessibility-widget]) h5,
      body:not([data-accessibility-widget]) h6 {
        background-color: #ffffcc !important;
        border: 1px solid #e6e600 !important;
        padding: 2px 5px !important;
        color: #000 !important;
      }
    `;
  }

  // Apply highlight links
  if (settings.highlightLinks) {
    cssRules += `
      body:not([data-accessibility-widget]) a,
      body:not([data-accessibility-widget]) button,
      body:not([data-accessibility-widget]) [role="button"],
      body:not([data-accessibility-widget]) [role="link"] {
        background-color: #ffff00 !important;
        color: #000000 !important;
        border: 1px solid #e6e600 !important;
        text-decoration: underline !important;
        padding: 2px 5px !important;
        font-weight: bold !important;
      }
    `;
  }

  // Apply hide images
  if (settings.hideImages) {
    cssRules += `
      body:not([data-accessibility-widget]) img,
      body:not([data-accessibility-widget]) svg,
      body:not([data-accessibility-widget]) picture,
      body:not([data-accessibility-widget]) video,
      body:not([data-accessibility-widget]) canvas,
      body:not([data-accessibility-widget]) [role="img"] {
        display: none !important;
      }
    `;
  }

  // Stop Animations: Alle Animationen und Transitionen deaktivieren (CSS + JS)
  if (settings.stopAnimations) {
    cssRules += `
      html *, html *::before, html *::after {
        animation: none !important;
        transition: none !important;
        scroll-behavior: auto !important;
      }
    `;
    // Zusätzlich: Alle Inline-Animationen und Web-Animations stoppen
    const allElements = document.querySelectorAll('html *');
    allElements.forEach(el => {
      (el as HTMLElement).style.animation = 'none';
      (el as HTMLElement).style.transition = 'none';
      // Web Animations API stoppen
      if (typeof (el as any).getAnimations === 'function') {
        (el as any).getAnimations().forEach((anim: Animation) => anim.cancel());
      }
    });
  } else {
    // Beim Deaktivieren: Inline-Styles zurücksetzen
    const allElements = document.querySelectorAll('html *');
    allElements.forEach(el => {
      (el as HTMLElement).style.animation = '';
      (el as HTMLElement).style.transition = '';
    });
  }

  // Filter für alle Features kombinieren
  const filterValues = [];
  if (settings.saturation !== 100) {
    filterValues.push(`saturate(${settings.saturation}%)`);
  }
  if (settings.monochrome > 0) {
    filterValues.push(`grayscale(${settings.monochrome}%)`);
  }
  if (settings.darkMode && isPageBright()) {
    cssRules += `
      html, body {
        background: #181818 !important;
        color: #f0f0f0 !important;
      }
      a, button, input, textarea, select {
        color: #f0f0f0 !important;
        background: #222 !important;
        border-color: #333 !important;
      }
      a {
        color: #8ab4f8 !important;
      }
      img, video {
        filter: brightness(0.7) contrast(1.1) !important;
      }
    `;
  }
  const filterValue = filterValues.length > 0 ? filterValues.join(' ') : 'none';

  cssRules += `
    html {
      filter: ${filterValue} !important;
    }
    img, video {
      filter: ${filterValue} !important;
    }
  `;

  // Highlight Focus: Sichtbaren Fokus-Rahmen setzen
  if (settings.highlightFocus) {
    cssRules += `
      *:focus,
      [data-accessibility-widget] *:focus {
        outline: 3px solid #FF9900 !important;
        outline-offset: 3px !important;
        box-shadow: 0 0 0 2px #fff, 0 0 0 5px #FF9900 !important;
      }
    `;
  }

  // Highlight Focus auch im ShadowRoot des Widgets anzeigen
  if (shadowRoot) {
    // Vorheriges Style-Tag entfernen
    const existingWidgetFocusStyle = shadowRoot.getElementById('widget-highlight-focus-style');
    if (existingWidgetFocusStyle) existingWidgetFocusStyle.remove();

    if (settings.highlightFocus) {
      const widgetFocusStyle = document.createElement('style');
      widgetFocusStyle.id = 'widget-highlight-focus-style';
      widgetFocusStyle.textContent = `
        *:focus {
          outline: 3px solid #FF9900 !important;
          outline-offset: 3px !important;
          box-shadow: 0 0 0 2px #fff, 0 0 0 5px #FF9900 !important;
        }
      `;
      shadowRoot.appendChild(widgetFocusStyle);
    }
  }

  // Selektiver Darkmode anwenden oder zurücksetzen
  applySelectiveDarkmode(!!settings.darkMode);

  // Set the CSS rules
  styleElement.textContent = cssRules;

  // Style-Tag immer im <head> der Host-Seite einfügen
  document.head.appendChild(styleElement);

  // Apply additional features that require JavaScript
  if (settings.keyboardNavigation) {
    enableKeyboardNavigation();
  } else {
    disableKeyboardNavigation();
  }

  if (settings.virtualKeyboard) {
    showVirtualKeyboard(shadowRoot);
  } else {
    hideVirtualKeyboard(shadowRoot);
  }

  if (settings.pageStructure) {
    showPageStructure();
  } else {
    hidePageStructure();
  }

  if (settings.readingMask) {
    handleReadingMask();
  } else {
    removeReadingMask();
  }

  if (settings.readingGuide) {
    handleReadingGuide();
  } else {
    removeReadingGuide();
  }

  // Only apply custom cursor on non-touch devices
  if (settings.customCursor && !isTouchDevice()) {
    handleCustomCursor(settings);
  } else {
    removeCustomCursor();
  }

  if (settings.highlightLinks) {
    document.body.classList.add('highlight-links');
  }
}