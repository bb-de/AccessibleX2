import { AccessibilitySettings } from '@/contexts/AccessibilityContext';
import { getTextColorStyles, getTitleColorStyles, getBackgroundColorStyles } from './color-helpers';

// Global variable to store the last active input element
let _lastActiveInput: HTMLInputElement | HTMLTextAreaElement | null = null;
let _focusListener: ((event: FocusEvent) => void) | null = null;

// Helper function to enable keyboard navigation
function enableKeyboardNavigation(): void {
  // Create a container for keyboard navigation helpers
  const navHelper = document.createElement('div');
  navHelper.id = 'keyboard-nav-helpers';
  navHelper.style.position = 'fixed';
  navHelper.style.bottom = '20px';
  navHelper.style.right = '20px';
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

  // Add close button event listener
  const closeButton = document.getElementById('close-keyboard-nav');
  if (closeButton) {
    closeButton.addEventListener('click', disableKeyboardNavigation);
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
}

// Helper function to show virtual keyboard
function showVirtualKeyboard(shadowRoot?: ShadowRoot): void {
  console.log("Debug: showVirtualKeyboard called.");
  // Store the currently active element if it's an input or textarea
  const currentActiveElementOnShow = getActiveElement(document);
  if (currentActiveElementOnShow instanceof HTMLInputElement || currentActiveElementOnShow instanceof HTMLTextAreaElement) {
    _lastActiveInput = currentActiveElementOnShow;
    console.log("Debug: Stored _lastActiveInput on show (initial):", _lastActiveInput);
  } else {
    // Do NOT set to null here. We rely on the focusin listener to find the correct input.
    console.log("Debug: No active input/textarea initially. Will rely on focusin. Current active element:", currentActiveElementOnShow);
  }

  // Add a focus listener to update _lastActiveInput dynamically
  if (!_focusListener) {
    _focusListener = (event: FocusEvent) => {
      const target = event.target;
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        _lastActiveInput = target;
        console.log("Debug: Updated _lastActiveInput on focusin event:", _lastActiveInput);
      } else {
        console.log("Debug: focusin event on non-input/textarea element:", target);
      }
    };
    document.addEventListener('focusin', _focusListener, { capture: true });
    console.log("Debug: Added focusin listener for dynamic _lastActiveInput updates.");
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
    console.log("Debug: Virtual Keyboard Close Button clicked.", event.target);
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

      // Log key button text content for debugging
      if (key === 'q') {
        console.log(`Debug: 'q' key textContent: ${keyButton.textContent}`);
        console.log(`Debug: 'q' key computed style:`, window.getComputedStyle(keyButton));
      }
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
    console.log('Debug: Keyboard style appended to shadowRoot');
  } else {
    document.head.appendChild(keyboardStyle);
    console.log('Debug: Keyboard style appended to document.head');
  }

  // Add to the document or shadow DOM
  if (shadowRoot) {
    shadowRoot.appendChild(keyboard);
    console.log('Debug: Virtual keyboard appended to shadowRoot');
  } else {
    document.body.appendChild(keyboard);
    console.log('Debug: Virtual keyboard appended to document.body');
  }

  // Explicitly focus on the last active input if it exists
  if (_lastActiveInput) {
    _lastActiveInput.focus();
    // Re-set selection range to ensure cursor is at the end or where it was
    const val = _lastActiveInput.value;
    _lastActiveInput.selectionStart = _lastActiveInput.selectionEnd = val.length;
    console.log("Debug: Explicitly focused on _lastActiveInput after keyboard shown:", _lastActiveInput);
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
    console.log("Debug: getActiveElement - current root:", root, "activeElement:", activeElement);
    if (!activeElement || !activeElement.shadowRoot) {
      return activeElement;
    }
    return getActiveElement(activeElement.shadowRoot);
  }

  // Insert text at cursor position
  function insertTextAtCursor(text: string) {
    const activeElement = _lastActiveInput;
    console.log("Debug: insertTextAtCursor - activeElement (using _lastActiveInput):", activeElement);

    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      console.log("Debug: insertTextAtCursor - activeElement is input/textarea.");
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;
      console.log(`Debug: insertTextAtCursor - start: ${start}, end: ${end}, value: ${value}`);

      activeElement.value = value.substring(0, start) + (shiftEnabled && text.length === 1 ? text.toUpperCase() : text) + value.substring(end);
      console.log("Debug: insertTextAtCursor - new value:", activeElement.value);

      // Set cursor position after inserted text
      activeElement.selectionStart = activeElement.selectionEnd = start + 1;

      // Trigger input event for form validation
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
      console.log("Debug: insertTextAtCursor - input event dispatched.");
    } else {
      console.log("Debug: insertTextAtCursor - _lastActiveInput is NOT input/textarea or is null.", activeElement);
    }
  }

  // Delete text at cursor position
  function deleteTextAtCursor() {
    const activeElement = _lastActiveInput;
    console.log("Debug: deleteTextAtCursor - activeElement (using _lastActiveInput):", activeElement);

    if (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement) {
      console.log("Debug: deleteTextAtCursor - activeElement is input/textarea.");
      const start = activeElement.selectionStart || 0;
      const end = activeElement.selectionEnd || 0;
      const value = activeElement.value;
      console.log(`Debug: deleteTextAtCursor - start: ${start}, end: ${end}, value: ${value}`);

      if (start === end && start > 0) {
        // No selection, delete character before cursor
        activeElement.value = value.substring(0, start - 1) + value.substring(end);
        activeElement.selectionStart = activeElement.selectionEnd = start - 1;
        console.log("Debug: deleteTextAtCursor - new value (delete before cursor):", activeElement.value);
      } else if (start !== end) {
        // Delete selected text
        activeElement.value = value.substring(0, start) + value.substring(end);
        activeElement.selectionStart = activeElement.selectionEnd = start;
        console.log("Debug: deleteTextAtCursor - new value (delete selected):", activeElement.value);
      }

      // Trigger input event for form validation
      const event = new Event('input', { bubbles: true });
      activeElement.dispatchEvent(event);
      console.log("Debug: deleteTextAtCursor - input event dispatched.");
    } else {
      console.log("Debug: deleteTextAtCursor - _lastActiveInput is NOT input/textarea or is null.", activeElement);
    }
  }
}

// Helper function to hide virtual keyboard
function hideVirtualKeyboard(currentShadowRoot?: ShadowRoot): void {
  console.log("Debug: hideVirtualKeyboard called.");
  console.log("Debug: hideVirtualKeyboard - currentShadowRoot received:", currentShadowRoot);
  let keyboard: HTMLElement | null = null;

  if (currentShadowRoot) {
    keyboard = currentShadowRoot.getElementById('virtual-keyboard');
    console.log("Debug: Keyboard search in currentShadowRoot:", keyboard);
    if (keyboard) {
        console.log("Debug: Keyboard found in currentShadowRoot. Its parent is:", keyboard.parentNode);
    }
  }

  // If not found in currentShadowRoot or no currentShadowRoot, check document body
  if (!keyboard) {
    keyboard = document.body.querySelector('#virtual-keyboard');
    console.log("Debug: Keyboard search in document.body:", keyboard);
  }

  if (keyboard) {
    keyboard.remove();
    console.log("Virtual keyboard removed");

    // Remove focus listener when keyboard is hidden
    if (_focusListener) {
      document.removeEventListener('focusin', _focusListener, { capture: true });
      _focusListener = null;
      console.log("Debug: Removed focusin listener.");
    }

    // Reset virtual keyboard setting
    const event = new CustomEvent('accessibility:virtual-keyboard-closed');
    document.dispatchEvent(event);
    console.log("Debug: accessibility:virtual-keyboard-closed event dispatched");
  } else {
    console.log("Debug: Virtual keyboard not found to remove.");
  }
}

// Helper function to show page structure
function showPageStructure(): void {
  // Entferne zuerst alle existierenden Page Structure Elemente
  hidePageStructure();

  // Erstelle einen Container für die Page Structure
  const pageStructureContainer = document.createElement('div');
  pageStructureContainer.id = 'page-structure-container';
  pageStructureContainer.style.position = 'fixed';
  pageStructureContainer.style.top = '0';
  pageStructureContainer.style.left = '0';
  pageStructureContainer.style.width = '100%';
  pageStructureContainer.style.height = '100%';
  pageStructureContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  pageStructureContainer.style.zIndex = '9999';
  pageStructureContainer.style.overflow = 'auto';
  pageStructureContainer.style.padding = '20px';
  pageStructureContainer.style.boxSizing = 'border-box';

  // Erstelle den Inhalt
  const content = document.createElement('div');
  content.style.backgroundColor = 'white';
  content.style.padding = '20px';
  content.style.borderRadius = '8px';
  content.style.maxWidth = '800px';
  content.style.margin = '0 auto';

  // Füge den Inhalt zum Container hinzu
  pageStructureContainer.appendChild(content);

  // Füge den Container zum Body hinzu
  document.body.appendChild(pageStructureContainer);

  // Baue die verschiedenen Komponenten
  const sections = [
    { title: 'Inhaltsverzeichnis', buildFn: buildTableOfContents },
    { title: 'Schnellzugriff', buildFn: buildSkipLinks },
    { title: 'Seitenbereiche', buildFn: buildLandmarks },
    { title: 'Überschriften', buildFn: buildHeadings },
    { title: 'Breadcrumbs', buildFn: buildBreadcrumbs },
    { title: 'Seitenstruktur', buildFn: buildPageStructure }
  ];

  sections.forEach(({ title, buildFn }) => {
    const section = document.createElement('div');
    section.className = `${title.toLowerCase().replace(/\s+/g, '-')}-section`;
    section.style.marginBottom = '20px';

    const sectionTitle = document.createElement('h2');
    sectionTitle.textContent = title;
    sectionTitle.style.fontSize = '1.5em';
    sectionTitle.style.marginBottom = '10px';

    section.appendChild(sectionTitle);
    buildFn(section);
    content.appendChild(section);
  });

  // Füge Event-Listener für ESC-Taste hinzu
  document.addEventListener('keydown', function handleEscKey(e) {
    if (e.key === 'Escape') {
      hidePageStructure();
      document.removeEventListener('keydown', handleEscKey);
    }
  });
}

function buildTableOfContents(container: HTMLElement): void {
  const tocList = document.createElement('ul');
  tocList.style.listStyle = 'none';
  tocList.style.padding = '0';

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    if (heading instanceof HTMLElement) {
      const listItem = document.createElement('li');
      listItem.style.margin = '5px 0';
      listItem.style.paddingLeft = `${(parseInt(heading.tagName[1]) - 1) * 20}px`;

      const link = document.createElement('a');
      link.textContent = heading.textContent || `Überschrift ${index + 1}`;
      link.href = '#';
      link.style.color = '#0066cc';
      link.style.textDecoration = 'none';

      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    }
  });

  container.appendChild(tocList);
}

function buildSkipLinks(container: HTMLElement): void {
  const skipLinksList = document.createElement('ul');
  skipLinksList.style.listStyle = 'none';
  skipLinksList.style.padding = '0';

  const skipPoints = [
    { text: 'Zum Hauptinhalt', selector: 'main, [role="main"]' },
    { text: 'Zur Navigation', selector: 'nav, [role="navigation"]' },
    { text: 'Zur Suche', selector: 'form[role="search"], input[type="search"]' },
    { text: 'Zum Footer', selector: 'footer, [role="contentinfo"]' }
  ];

  skipPoints.forEach(({ text, selector }) => {
    const element = document.querySelector(selector);
    if (element) {
      const listItem = document.createElement('li');
      listItem.style.margin = '5px 0';

      const link = document.createElement('a');
      link.textContent = text;
      link.href = '#';
      link.style.color = '#0066cc';
      link.style.textDecoration = 'none';

      link.addEventListener('click', (e) => {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        if (element instanceof HTMLElement) {
          element.focus();
        }
      });

      listItem.appendChild(link);
      skipLinksList.appendChild(listItem);
    }
  });

  container.appendChild(skipLinksList);
}

function buildLandmarks(container: HTMLElement): void {
  const landmarksList = document.createElement('ul');
  landmarksList.style.listStyle = 'none';
  landmarksList.style.padding = '0';

  const landmarks = [
    { text: 'Header', selector: 'header, [role="banner"]' },
    { text: 'Navigation', selector: 'nav, [role="navigation"]' },
    { text: 'Hauptinhalt', selector: 'main, [role="main"]' },
    { text: 'Seitenleiste', selector: 'aside, [role="complementary"]' },
    { text: 'Footer', selector: 'footer, [role="contentinfo"]' },
    { text: 'Suche', selector: 'form[role="search"]' }
  ];

  landmarks.forEach(({ text, selector }) => {
    const element = document.querySelector(selector);
    if (element) {
      const listItem = document.createElement('li');
      listItem.style.margin = '5px 0';

      const link = document.createElement('a');
      link.textContent = text;
      link.href = '#';
      link.style.color = '#0066cc';
      link.style.textDecoration = 'none';

      link.addEventListener('click', (e) => {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
      });

      listItem.appendChild(link);
      landmarksList.appendChild(listItem);
    }
  });

  container.appendChild(landmarksList);
}

function buildHeadings(container: HTMLElement): void {
  const headingsList = document.createElement('ul');
  headingsList.style.listStyle = 'none';
  headingsList.style.padding = '0';

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading, index) => {
    if (heading instanceof HTMLElement) {
      const listItem = document.createElement('li');
      listItem.style.margin = '5px 0';
      listItem.style.paddingLeft = `${(parseInt(heading.tagName[1]) - 1) * 20}px`;

      const link = document.createElement('a');
      link.textContent = heading.textContent || `Überschrift ${index + 1}`;
      link.href = '#';
      link.style.color = '#0066cc';
      link.style.textDecoration = 'none';

      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth' });
      });

      listItem.appendChild(link);
      headingsList.appendChild(listItem);
    }
  });

  container.appendChild(headingsList);
}

function buildBreadcrumbs(container: HTMLElement): void {
  const breadcrumbsList = document.createElement('ul');
  breadcrumbsList.style.listStyle = 'none';
  breadcrumbsList.style.padding = '0';

  const breadcrumbs = document.querySelector('nav[aria-label="breadcrumb"], [role="navigation"][aria-label="breadcrumb"]');
  if (breadcrumbs) {
    const links = breadcrumbs.querySelectorAll('a');
    links.forEach((link, index) => {
      const listItem = document.createElement('li');
      listItem.style.margin = '5px 0';
      listItem.style.display = 'inline';

      const breadcrumbLink = document.createElement('a');
      breadcrumbLink.textContent = link.textContent || `Link ${index + 1}`;
      breadcrumbLink.href = link.href;
      breadcrumbLink.style.color = '#0066cc';
      breadcrumbLink.style.textDecoration = 'none';

      listItem.appendChild(breadcrumbLink);
      breadcrumbsList.appendChild(listItem);

      if (index < links.length - 1) {
        const separator = document.createElement('span');
        separator.textContent = ' > ';
        separator.style.margin = '0 5px';
        separator.style.color = '#666';
        breadcrumbsList.appendChild(separator);
      }
    });
  } else {
    const listItem = document.createElement('li');
    listItem.textContent = 'Keine Breadcrumbs gefunden';
    listItem.style.color = '#666';
    breadcrumbsList.appendChild(listItem);
  }

  container.appendChild(breadcrumbsList);
}

function buildPageStructure(container: HTMLElement): void {
  const structureList = document.createElement('ul');
  structureList.style.listStyle = 'none';
  structureList.style.padding = '0';

  function buildStructure(element: Element, level: number = 0): void {
    if (element instanceof HTMLElement) {
      const listItem = document.createElement('li');
      listItem.style.margin = '5px 0';
      listItem.style.paddingLeft = `${level * 20}px`;

      const link = document.createElement('a');
      link.textContent = `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}${element.className ? `.${element.className.split(' ').join('.')}` : ''}`;
      link.href = '#';
      link.style.color = '#0066cc';
      link.style.textDecoration = 'none';

      link.addEventListener('click', (e) => {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
      });

      listItem.appendChild(link);
      structureList.appendChild(listItem);

      Array.from(element.children).forEach(child => {
        buildStructure(child, level + 1);
      });
    }
  }

  buildStructure(document.body);
  container.appendChild(structureList);
}

// Helper function to hide page structure
function hidePageStructure(): void {
  const panel = document.getElementById('page-structure-panel');
  if (panel) {
    panel.remove();

    // Create a custom event that will be listened to by the React app
    const customEvent = new CustomEvent('accessibility:page-structure-closed', {
      bubbles: true
    });
    document.dispatchEvent(customEvent);
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
  const cursor = document.getElementById('custom-cursor');
  if (cursor) {
    const target = e.target as HTMLElement;
    const isOverWidget = target.closest('[data-accessibility-widget]');

    // Holen Sie die aktuelle Cursorgröße in Pixeln
    const cursorElementWidth = cursor.offsetWidth;
    const cursorElementHeight = cursor.offsetHeight;

    // Der Hotspot des SVG-Cursors ist bei (13, 5) im 50x50 ViewBox
    // Berechnen Sie den Offset relativ zur tatsächlichen Größe des SVG-Elements
    const offsetX = (13 / 50) * cursorElementWidth;
    const offsetY = (5 / 50) * cursorElementHeight;

    if (isOverWidget) {
      cursor.style.display = 'none';
    } else {
      cursor.style.display = 'block';
      cursor.style.left = `${e.clientX - offsetX}px`;
      cursor.style.top = `${e.clientY - offsetY}px`;
      cursor.style.transform = 'none'; // Stellen Sie sicher, dass keine zusätzliche Transformation angewendet wird
    }
  }
}

// Helper function to remove custom cursor
function removeCustomCursor(): void {
  const customCursor = document.getElementById('custom-cursor');
  if (customCursor) {
    customCursor.remove();
  }

  // Remove event listener to prevent memory leaks
  document.removeEventListener('mousemove', handleMouseMove);
}

// Helper function to handle reading mask
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

  // Set common styles
  const commonStyles = {
    position: 'fixed',
    left: '0',
    width: '100%',
    pointerEvents: 'none',
    zIndex: '999999'
  };

  // Apply styles to top mask
  Object.assign(topMask.style, commonStyles, {
    top: '0',
    height: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  });

  // Apply styles to bottom mask
  Object.assign(bottomMask.style, commonStyles, {
    bottom: '0',
    height: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  });

  // Apply styles to focus strip
  Object.assign(focusStrip.style, commonStyles, {
    height: '100px',
    border: '2px solid rgba(255, 255, 0, 0.5)',
    boxSizing: 'border-box',
    backgroundColor: 'transparent'
  });

  // Add elements to the document
  document.body.appendChild(topMask);
  document.body.appendChild(bottomMask);
  document.body.appendChild(focusStrip);

  // Speichere aktuelle Mausposition global
  if (!window.hasOwnProperty('lastKnownMousePosition')) {
    // Initialisiere globale Variablen, falls noch nicht vorhanden
    (window as any).lastKnownMousePosition = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };

    // Tracking-Funktion für die Mausposition einrichten (läuft nur einmal)
    document.addEventListener('mousemove', (e) => {
      (window as any).lastKnownMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    });
  }

  // Verwende die zuletzt gespeicherte Mausposition für die initiale Platzierung
  const cursorX = (window as any).lastKnownMousePosition.x;
  const cursorY = (window as any).lastKnownMousePosition.y;

  // Starte mit der aktuellen Mausposition
  const initialEvent = new MouseEvent('mousemove', {
    clientX: cursorX,
    clientY: cursorY,
    bubbles: true
  });
  updateReadingMask(initialEvent);

  // Add mousemove handler to update mask positions
  document.addEventListener('mousemove', updateReadingMask);
}

// Helper function to update reading mask position
function updateReadingMask(e: MouseEvent): void {
  const topMask = document.getElementById('reading-mask-top');
  const bottomMask = document.getElementById('reading-mask-bottom');
  const focusStrip = document.getElementById('reading-mask-focus');

  if (topMask && bottomMask && focusStrip) {
    const focusHeight = 100; // Height of the focus strip
    const mouseY = e.clientY;
    const windowHeight = window.innerHeight;

    // Calculate positions
    const focusStripTop = mouseY - focusHeight / 2;
    const topMaskHeight = Math.max(0, focusStripTop);
    const bottomMaskTop = Math.min(windowHeight, mouseY + focusHeight / 2);
    const bottomMaskHeight = Math.max(0, windowHeight - bottomMaskTop);

    // Update element positions
    topMask.style.height = `${topMaskHeight}px`;
    bottomMask.style.top = `${bottomMaskTop}px`;
    bottomMask.style.height = `${bottomMaskHeight}px`;
    focusStrip.style.top = `${focusStripTop}px`;
  }
}

// Helper function to remove reading mask
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

  // Remove event listener to prevent memory leaks
  document.removeEventListener('mousemove', updateReadingMask);
}

// Helper function to handle reading guide
function handleReadingGuide(): void {
  // Remove any existing reading guide first
  removeReadingGuide();

  // Create guide element
  const guide = document.createElement('div');
  guide.id = 'reading-guide';

  // Apply styles
  guide.style.position = 'fixed';
  guide.style.left = '0';
  guide.style.width = '100%';
  guide.style.height = '30px';
  guide.style.backgroundColor = 'rgba(255, 255, 0, 0.2)';
  guide.style.border = '1px solid rgba(255, 255, 0, 0.5)';
  guide.style.pointerEvents = 'none';
  guide.style.zIndex = '9999';

  // Add to document
  document.body.appendChild(guide);

  // Add mousemove handler
  document.addEventListener('mousemove', updateReadingGuide);
}

// Helper function to update reading guide position
function updateReadingGuide(e: MouseEvent): void {
  const guide = document.getElementById('reading-guide');
  if (guide) {
    guide.style.top = `${e.clientY}px`;
  }
}

// Helper function to remove reading guide
function removeReadingGuide(): void {
  const guide = document.getElementById('reading-guide');
  if (guide) guide.remove();

  // Remove event listener to prevent memory leaks
  document.removeEventListener('mousemove', updateReadingGuide);
}

// Helper function for contrast modes
function getContrastModeStyles(contrastMode: string): string {
  switch (contrastMode) {
    case 'increased':
      return `
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
    case 'high':
      return `
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
    case 'dark':
      return `
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
    case 'light':
      return `
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
    default:
      return '';
  }
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

// Apply multiple style adjustments based on the active settings
export function applyAccessibilityStyles(settings: AccessibilitySettings, shadowRoot?: ShadowRoot): void {
  // Remove any existing accessibility styles
  const existingStyle = document.getElementById('accessibility-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create a new style element for all accessibility adjustments
  const styleElement = document.createElement('style');
  styleElement.id = 'accessibility-styles';

  let cssRules = '';

  // Apply contrast mode styles
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
      html {
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
      p, div, span, li {
        line-height: ${1.5 + (settings.lineHeight * 0.15)} !important;
      }

      /* Exclude accessibility widget */
      [data-accessibility-widget] p,
      [data-accessibility-widget] div,
      [data-accessibility-widget] span,
      [data-accessibility-widget] li {
        line-height: initial !important;
      }
    `;
  }

  // Apply letter spacing
  if (settings.letterSpacing !== 0) {
    cssRules += `
      body, p, div, span, li, a, h1, h2, h3, h4, h5, h6, button, input, textarea, select {
        letter-spacing: ${settings.letterSpacing * 0.05}em !important;
      }

      /* Exclude accessibility widget */
      [data-accessibility-widget],
      [data-accessibility-widget] * {
        letter-spacing: normal !important;
      }
    `;
  }

  // Apply word spacing
  if (settings.wordSpacing > 0) {
    cssRules += `
      body, p, div, span, li, a, h1, h2, h3, h4, h5, h6, button, input, textarea, select {
        word-spacing: ${settings.wordSpacing * 0.05}em !important;
      }

      /* Exclude accessibility widget */
      [data-accessibility-widget],
      [data-accessibility-widget] * {
        word-spacing: normal !important;
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
      /* Apply text alignment to all content elements EXCEPT the widget */
      html body p:not([data-accessibility-widget="true"] p):not([data-accessibility-widget="true"] *),
      html body div:not([data-accessibility-widget="true"]):not([data-accessibility-widget="true"] *),
      html body li:not([data-accessibility-widget="true"] li):not([data-accessibility-widget="true"] *),
      html body h1:not([data-accessibility-widget="true"] h1):not([data-accessibility-widget="true"] *),
      html body h2:not([data-accessibility-widget="true"] h2):not([data-accessibility-widget="true"] *),
      html body h3:not([data-accessibility-widget="true"] h3):not([data-accessibility-widget="true"] *),
      html body h4:not([data-accessibility-widget="true"] h4):not([data-accessibility-widget="true"] *),
      html body h5:not([data-accessibility-widget="true"] h5):not([data-accessibility-widget="true"] *),
      html body h6:not([data-accessibility-widget="true"] h6):not([data-accessibility-widget="true"] *) {
        text-align: ${alignValue} !important;
      }
    `;
  }

  // Apply highlight titles
  if (settings.highlightTitles) {
    cssRules += `
      /* Apply only to heading elements EXCEPT the widget */
      html body h1:not([data-accessibility-widget="true"] h1):not([data-accessibility-widget="true"] *),
      html body h2:not([data-accessibility-widget="true"] h2):not([data-accessibility-widget="true"] *),
      html body h3:not([data-accessibility-widget="true"] h3):not([data-accessibility-widget="true"] *),
      html body h4:not([data-accessibility-widget="true"] h4):not([data-accessibility-widget="true"] *),
      html body h5:not([data-accessibility-widget="true"] h5):not([data-accessibility-widget="true"] *),
      html body h6:not([data-accessibility-widget="true"] h6):not([data-accessibility-widget="true"] *) {
        background-color: #ffffcc !important;
        border: 1px solid #e6e600 !important;
        padding: 2px 5px !important;
      }
    `;
  }

  // Apply highlight links
  if (settings.highlightLinks) {
    cssRules += `
      /* Apply only to content elements EXCEPT the widget */
      html body a:not([data-accessibility-widget="true"] a):not([data-accessibility-widget="true"] *),
      html body button:not([data-accessibility-widget="true"] button):not([data-accessibility-widget="true"] *),
      html body [role="button"]:not([data-accessibility-widget="true"] [role="button"]):not([data-accessibility-widget="true"] *),
      html body [role="link"]:not([data-accessibility-widget="true"] [role="link"]):not([data-accessibility-widget="true"] *) {
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
      img, svg, picture, video, canvas, [role="img"] {
        display: none !important;
      }

      /* Exclude accessibility widget */
      [data-accessibility-widget] img,
      [data-accessibility-widget] svg,
      [data-accessibility-widget] picture,
      [data-accessibility-widget] video,
      [data-accessibility-widget] canvas,
      [data-accessibility-widget] [role="img"] {
        display: initial !important;
      }
    `;
  }

  // Apply stop animations
  if (settings.stopAnimations) {
    cssRules += `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
      }

      /* Exclude accessibility widget */
      [data-accessibility-widget],
      [data-accessibility-widget] *,
      [data-accessibility-widget] *::before,
      [data-accessibility-widget] *::after {
        animation: initial !important;
        transition: initial !important;
      }
    `;
  }

  // Apply highlight focus
  if (settings.highlightFocus) {
    cssRules += `
      *:focus {
        outline: 3px solid #ff6600 !important;
        outline-offset: 2px !important;
      }
    `;
  }

  // Apply keyboard navigation
  if (settings.keyboardNavigation) {
    // Add keyboard navigation helpers
    const keyboardNavHelpers = document.getElementById('keyboard-nav-helpers');
    if (!keyboardNavHelpers) {
      enableKeyboardNavigation();
    }
  } else {
    // Remove keyboard navigation helpers
    disableKeyboardNavigation();
  }

  // Apply virtual keyboard
  if (settings.virtualKeyboard) {
    // Add virtual keyboard
    const virtualKeyboard = document.getElementById('virtual-keyboard');
    if (!virtualKeyboard) {
      showVirtualKeyboard(shadowRoot);
    }
  } else {
    // Remove virtual keyboard
    hideVirtualKeyboard(shadowRoot);
  }

  // Apply page structure
  if (settings.pageStructure) {
    // Add page structure panel
    const pageStructurePanel = document.getElementById('page-structure-panel');
    if (!pageStructurePanel) {
      showPageStructure();
    }
  } else {
    // Remove page structure panel
    hidePageStructure();
  }

  // Apply custom cursor styles
  if (settings.customCursor) {
    // Handle the custom cursor implementation
    handleCustomCursor(settings);

    // Hide original cursor on content (but not on the widget)
    cssRules += `
      body *:not([data-accessibility-widget]):not([data-accessibility-widget] *) {
        cursor: none !important;
      }

      [data-accessibility-widget],
      [data-accessibility-widget] * {
        cursor: default !important;
      }
    `;
  } else {
    // Remove custom cursor if setting is turned off
    removeCustomCursor();

    // Reset cursor styles
    cssRules += `
      * {
        cursor: default;
      }

      a, button, [role="button"] {
        cursor: pointer;
      }
    `;
  }

  // Apply saturation and monochrome filters
  if (settings.saturation !== 100 || settings.monochrome > 0) {
    const filterValues = [];

    if (settings.saturation !== 100) {
      filterValues.push(`saturate(${settings.saturation}%)`);
    }

    if (settings.monochrome > 0) {
      filterValues.push(`grayscale(${settings.monochrome}%)`);
    }

    const filterValue = filterValues.join(' ');

    cssRules += `
      html, img, video {
        filter: ${filterValue} !important;
      }
    `;
  }

  // Apply dark mode
  if (settings.darkMode) {
    cssRules += `
      html {
        filter: invert(100%) hue-rotate(180deg) !important;
      }
      img, video {
        filter: invert(100%) hue-rotate(180deg) !important;
      }

      /* Exclude accessibility widget */
      [data-accessibility-widget],
      [data-accessibility-widget] * {
        filter: none !important;
      }
      [data-accessibility-widget] img,
      [data-accessibility-widget] video {
        filter: none !important;
      }
    `;
  }

  // Apply reading mask
  if (settings.readingMask) {
    handleReadingMask();
  } else {
    removeReadingMask();
  }

  // Apply reading guide
  if (settings.readingGuide) {
    handleReadingGuide();
  } else {
    removeReadingGuide();
  }

  // Apply all CSS rules
  styleElement.textContent = cssRules;
  document.head.appendChild(styleElement);
}