import { AccessibilitySettings } from '@/contexts/AccessibilityContext';
import { getTextColorStyles, getTitleColorStyles, getBackgroundColorStyles } from './color-helpers';

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
function showVirtualKeyboard(): void {
  // Create a keyboard container
  const keyboard = document.createElement('div');
  keyboard.id = 'virtual-keyboard';
  keyboard.style.position = 'fixed';
  keyboard.style.bottom = '0';
  keyboard.style.left = '0';
  keyboard.style.width = '100%';
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
  const closeBar = document.createElement('div');
  closeBar.style.display = 'flex';
  closeBar.style.justifyContent = 'space-between';
  closeBar.style.alignItems = 'center';
  closeBar.style.marginBottom = '10px';

  const keyboardTitle = document.createElement('span');
  keyboardTitle.textContent = 'Virtual Keyboard';
  keyboardTitle.style.fontWeight = 'bold';
  keyboardTitle.style.fontSize = '14px';

  const closeButton = document.createElement('button');
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
  closeButton.addEventListener('click', hideVirtualKeyboard);

  closeBar.appendChild(keyboardTitle);
  closeBar.appendChild(closeButton);
  keyboard.appendChild(closeBar);

  // Create keyboard layout
  keyboardRows.forEach(row => {
    const rowElement = document.createElement('div');
    rowElement.style.display = 'flex';
    rowElement.style.justifyContent = 'center';
    rowElement.style.margin = '5px 0';

    row.forEach(key => {
      const keyButton = document.createElement('button');
      keyButton.textContent = key;
      keyButton.style.margin = '2px';
      keyButton.style.minWidth = key === 'Space' ? '200px' : key === 'Backspace' || key === 'Shift' ? '80px' : '40px';
      keyButton.style.height = '40px';
      keyButton.style.backgroundColor = '#fff';
      keyButton.style.border = '1px solid #ccc';
      keyButton.style.borderRadius = '4px';
      keyButton.style.cursor = 'pointer';
      keyButton.style.fontSize = '14px';

      // Add key press functionality
      keyButton.addEventListener('click', () => {
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

  // Add to the document
  document.body.appendChild(keyboard);

  // Shift state
  let shiftEnabled = false;

  // Toggle shift key
  function toggleShift() {
    shiftEnabled = !shiftEnabled;

    // Update all letter keys
    const letterKeys = keyboard.querySelectorAll('button');
    letterKeys.forEach(button => {
      const keyText = button.textContent;
      if (keyText && keyText.length === 1 && /[a-z]/.test(keyText)) {
        button.textContent = shiftEnabled ? keyText.toUpperCase() : keyText.toLowerCase();
      }
    });
  }

  // Insert text at cursor position
  function insertTextAtCursor(text: string) {
    const activeElement = document.activeElement;

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
    const activeElement = document.activeElement;

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
function hideVirtualKeyboard(): void {
  const keyboard = document.getElementById('virtual-keyboard');
  if (keyboard) {
    keyboard.remove();
  }
}

// Helper function to show page structure
function showPageStructure(): void {
  // Import the language from AccessibilityContext if available, otherwise detect from document
  let language = 'de'; // Default to German

  try {
    // First check for explicitly saved language preference in localStorage
    const savedLanguage = localStorage.getItem('accessibility-language');
    if (savedLanguage && ['en', 'de', 'fr', 'es'].includes(savedLanguage)) {
      language = savedLanguage;
    }
    // Then try to get the language from the widget's context
    else {
      const accessibilityToggle = document.querySelector('[data-accessibility-widget]');
      if (accessibilityToggle) {
        const widgetLang = accessibilityToggle.getAttribute('data-lang');
        if (widgetLang && ['en', 'de', 'fr', 'es'].includes(widgetLang)) {
          language = widgetLang;
        }
      } else {
        // Fallback to document language
        const documentLang = document.documentElement.lang || 
                            document.querySelector('html')?.getAttribute('lang') || 
                            navigator.language || 
                            'de';

        if (documentLang.startsWith('en')) language = 'en';
        else if (documentLang.startsWith('fr')) language = 'fr';
        else if (documentLang.startsWith('es')) language = 'es';
        // Default is already 'de'
      }
    }
  } catch (error) {
    console.error('Error detecting language for accessibility widget:', error);
    // Default to German if there's an error
  }

  // Translations for UI elements
  const translations = {
    en: {
      panelTitle: 'Page Structure',
      closeAriaLabel: 'Close page structure',
      toc: 'Table of Contents',
      landmarks: 'Landmarks',
      headings: 'Headings',
      skipLinks: 'Skip Links',
      tocTitle: 'Table of Contents',
      noHeadings: 'No headings found on this page.',
      skipLinksTitle: 'Skip Links',
      skipToMain: 'Skip to main content',
      skipToNav: 'Skip to navigation',
      skipToSearch: 'Skip to search',
      skipToFooter: 'Skip to footer',
      skipToTop: 'Skip to top of page',
      noTargets: 'No skip targets found.',
      landmarksTitle: 'Landmarks Navigation',
      noLandmarks: 'No landmarks found on this page.',
      headingsTitle: 'Headings Navigation',
      noHeadingsFound: 'No headings found on this page.',
      breadcrumbsTitle: 'Breadcrumbs Navigation',
      homePage: 'You are on the home page',
      structureTitle: 'Page Structure',
      header: 'Header',
      main: 'Main Content',
      sidebar: 'Sidebar',
      footer: 'Footer',
      navigation: 'Navigation',
      columns: 'Multi-column Content',
      column: 'Column',
      currentView: 'Current Viewport'
    },
    de: {
      panelTitle: 'Seitenstruktur',
      closeAriaLabel: 'Seitenstruktur schließen',
      toc: 'Inhaltsverzeichnis',
      landmarks: 'Landmarken',
      headings: 'Überschriften',
      skipLinks: 'Sprungmarken',
      tocTitle: 'Inhaltsverzeichnis',
      noHeadings: 'Keine Überschriften gefunden.',
      skipLinksTitle: 'Sprungmarken',
      skipToMain: 'Zum Hauptinhalt',
      skipToNav: 'Zur Navigation',
      skipToSearch: 'Zur Suche',
      skipToFooter: 'Zum Footer',
      skipToTop: 'Zum Anfang der Seite',
      noTargets: 'Keine Sprungziele gefunden.',
      landmarksTitle: 'Landmarken-Navigation',
      noLandmarks: 'Keine Landmarken gefunden.',
      headingsTitle: 'Überschriften-Navigation',
      noHeadingsFound: 'Keine Überschriften gefunden.',
      breadcrumbsTitle: 'Breadcrumbs Navigation',
      homePage: 'Sie befinden sich auf der Startseite',
      structureTitle: 'Seitenstruktur',
      header: 'Header',
      main: 'Hauptinhalt',
      sidebar: 'Seitenleiste',
      footer: 'Fußzeile',
      navigation: 'Navigation',
      columns: 'Mehrspaltiger Inhalt',
      column: 'Spalte',
      currentView: 'Aktueller Bildschirmausschnitt'
    },
    fr: {
      panelTitle: 'Structure de la Page',
      closeAriaLabel: 'Fermer la structure de la page',
      toc: 'Table des Matières',
      landmarks: 'Points de Repère',
      headings: 'En-têtes',
      skipLinks: 'Liens de Saut',
      tocTitle: 'Table des Matières',
      noHeadings: 'Aucun en-tête trouvé sur cette page.',
      skipLinksTitle: 'Liens de Saut',
      skipToMain: 'Aller au contenu principal',
      skipToNav: 'Aller à la navigation',
      skipToSearch: 'Aller à la recherche',
      skipToFooter: 'Aller au bas de page',
      skipToTop: 'Aller en haut de la page',
      noTargets: 'Aucune cible de saut trouvée.',
      landmarksTitle: 'Navigation par Points de Repère',
      noLandmarks: 'Aucun point de repère trouvé.',
      headingsTitle: 'Navigation par En-têtes',
      noHeadingsFound: 'Aucun en-tête trouvé.',
      breadcrumbsTitle: 'Fil d\'Ariane',
      homePage: 'Vous êtes sur la page d\'accueil',
      structureTitle: 'Structure de la Page',
      header: 'En-tête',
      main: 'Contenu Principal',
      sidebar: 'Barre Latérale',
      footer: 'Pied de Page',
      navigation: 'Navigation',
      columns: 'Contenu Multi-colonnes',
      column: 'Colonne',
      currentView: 'Fenêtre Actuelle'
    },
    es: {
      panelTitle: 'Estructura de la Página',
      closeAriaLabel: 'Cerrar estructura de página',
      toc: 'Tabla de Contenidos',
      landmarks: 'Puntos de Referencia',
      headings: 'Encabezados',
      skipLinks: 'Enlaces de Salto',
      tocTitle: 'Tabla de Contenidos',
      noHeadings: 'No se encontraron encabezados en esta página.',
      skipLinksTitle: 'Enlaces de Salto',
      skipToMain: 'Saltar al contenido principal',
      skipToNav: 'Saltar a la navegación',
      skipToSearch: 'Saltar a la búsqueda',
      skipToFooter: 'Saltar al pie de página',
      skipToTop: 'Saltar al inicio de la página',
      noTargets: 'No se encontraron objetivos de salto.',
      landmarksTitle: 'Navegación por Puntos de Referencia',
      noLandmarks: 'No se encontraron puntos de referencia.',
      headingsTitle: 'Navegación por Encabezados',
      noHeadingsFound: 'No se encontraron encabezados.',
      breadcrumbsTitle: 'Navegación de Migas de Pan',
      homePage: 'Está en la página de inicio',
      structureTitle: 'Estructura de la Página',
      header: 'Encabezado',
      main: 'Contenido Principal',
      sidebar: 'Barra Lateral',
      footer: 'Pie de Página',
      navigation: 'Navegación',
      columns: 'Contenido de Múltiples Columnas',
      column: 'Columna',
      currentView: 'Vista Actual'
    }
  };

  // Get translation for current language
  const t = translations[language];

  // Create panel container on the left side
  const panel = document.createElement('div');
  panel.id = 'page-structure-panel';
  panel.style.position = 'fixed';
  panel.style.top = '0';
  panel.style.left = '0';
  panel.style.height = '100vh';
  panel.style.width = '320px';
  panel.style.backgroundColor = 'white';
  panel.style.overflowY = 'auto';
  panel.style.zIndex = '99998';
  panel.style.boxShadow = '2px 0 10px rgba(0, 0, 0, 0.2)';
  panel.style.padding = '0';
  panel.style.display = 'flex';
  panel.style.flexDirection = 'column';

  // Create header
  const header = document.createElement('div');
  header.style.padding = '15px';
  header.style.borderBottom = '1px solid #eee';
  header.style.display = 'flex';
  header.style.justifyContent = 'space-between';
  header.style.alignItems = 'center';
  header.style.backgroundColor = '#f8f8f8';

  // Add heading
  const heading = document.createElement('h2');
  heading.textContent = t.panelTitle;
  heading.style.fontSize = '18px';
  heading.style.margin = '0';
  heading.style.fontWeight = 'bold';

  // Add close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', t.closeAriaLabel);
  closeButton.style.backgroundColor = 'transparent';
  closeButton.style.border = 'none';
  closeButton.style.fontSize = '24px';
  closeButton.style.fontWeight = 'bold';
  closeButton.style.color = '#666';
  closeButton.style.cursor = 'pointer';
  closeButton.style.padding = '0 8px';
  closeButton.style.lineHeight = '1';
  closeButton.addEventListener('click', hidePageStructure);
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.color = '#000';
  });
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.color = '#666';
  });

  header.appendChild(heading);
  header.appendChild(closeButton);
  panel.appendChild(header);

  // Tab navigation
  const tabContainer = document.createElement('div');
  tabContainer.style.display = 'flex';
  tabContainer.style.borderBottom = '1px solid #eee';

  const tabs = [
    { id: 'toc', label: t.toc },
    { id: 'landmarks', label: t.landmarks },
    { id: 'headings', label: t.headings },
    { id: 'skiplinks', label: t.skipLinks }
  ];

  const tabButtons: {[key: string]: HTMLButtonElement} = {};
  const tabContents: {[key: string]: HTMLDivElement} = {};

  tabs.forEach(tab => {
    // Create tab button
    const tabButton = document.createElement('button');
    tabButton.textContent = tab.label;
    tabButton.dataset.tab = tab.id;
    tabButton.style.flex = '1';
    tabButton.style.padding = '10px';
    tabButton.style.backgroundColor = tab.id === 'toc' ? '#eee' : 'transparent';
    tabButton.style.border = 'none';
    tabButton.style.borderRight = '1px solid #eee';
    tabButton.style.cursor = 'pointer';
    tabButton.style.fontSize = '14px';

    // Create tab content
    const tabContent = document.createElement('div');
    tabContent.id = `tab-${tab.id}`;
    tabContent.style.padding = '15px';
    tabContent.style.display = tab.id === 'toc' ? 'block' : 'none';

    tabButtons[tab.id] = tabButton;
    tabContents[tab.id] = tabContent;

    tabButton.addEventListener('click', () => {
      // Update active tab
      Object.values(tabButtons).forEach(btn => {
        btn.style.backgroundColor = 'transparent';
      });
      Object.values(tabContents).forEach(content => {
        content.style.display = 'none';
      });

      tabButton.style.backgroundColor = '#eee';
      tabContent.style.display = 'block';
    });

    tabContainer.appendChild(tabButton);
  });

  panel.appendChild(tabContainer);

  // Content container
  const contentContainer = document.createElement('div');
  contentContainer.style.flex = '1';
  contentContainer.style.overflowY = 'auto';
  contentContainer.style.padding = '0';

  // 1. Table of Contents (Inhaltsverzeichnis)
  const tocContent = buildTableOfContents();
  tabContents['toc'].appendChild(tocContent);

  // 2. Skip Links (Sprungmarken)
  const skipLinksContent = buildSkipLinks();
  tabContents['skiplinks'].appendChild(skipLinksContent);

  // 3. Landmarks (Landmarken)
  const landmarksContent = buildLandmarks();
  tabContents['landmarks'].appendChild(landmarksContent);

  // 4. Headings (Überschriften)
  const headingsContent = buildHeadings();
  tabContents['headings'].appendChild(headingsContent);

  // 5. Add footer with Breadcrumbs Navigation
  const footerContainer = document.createElement('div');
  footerContainer.style.padding = '15px';
  footerContainer.style.borderTop = '1px solid #eee';
  footerContainer.style.backgroundColor = '#f8f8f8';

  const breadcrumbsHeading = document.createElement('h3');
  breadcrumbsHeading.textContent = t.breadcrumbsTitle;
  breadcrumbsHeading.style.fontSize = '14px';
  breadcrumbsHeading.style.margin = '0 0 10px 0';
  breadcrumbsHeading.style.fontWeight = 'bold';

  const breadcrumbsContent = buildBreadcrumbs();

  footerContainer.appendChild(breadcrumbsHeading);
  footerContainer.appendChild(breadcrumbsContent);

  // 6. Add Visual Structure section
  const structureContainer = document.createElement('div');
  structureContainer.style.padding = '15px';
  structureContainer.style.borderTop = '1px solid #eee';

  const structureHeading = document.createElement('h3');
  structureHeading.textContent = t.structureTitle;
  structureHeading.style.fontSize = '14px';
  structureHeading.style.margin = '0 0 10px 0';
  structureHeading.style.fontWeight = 'bold';

  const structureContent = buildPageStructure();

  structureContainer.appendChild(structureHeading);
  structureContainer.appendChild(structureContent);

  // Assemble the panel
  Object.values(tabContents).forEach(content => {
    contentContainer.appendChild(content);
  });

  panel.appendChild(contentContainer);
  panel.appendChild(footerContainer);
  panel.appendChild(structureContainer);
  document.body.appendChild(panel);

  // Add Escape key listener
  document.addEventListener('keydown', function handleEscKey(e) {
    if (e.key === 'Escape') {
      hidePageStructure();
      document.removeEventListener('keydown', handleEscKey);
    }
  });

  // Helper function to build table of contents
  function buildTableOfContents() {
    const container = document.createElement('div');

    const heading = document.createElement('h3');
    heading.textContent = t.tocTitle;
    heading.style.fontSize = '16px';
    heading.style.margin = '0 0 15px 0';
    heading.style.fontWeight = 'bold';

    const headings = Array.from(document.querySelectorAll('h1, h2, h3'))
      .filter(el => !el.closest('[data-accessibility-widget]'));

    if (headings.length > 0) {
      const list = document.createElement('ul');
      list.style.listStyleType = 'none';
      list.style.padding = '0';
      list.style.margin = '0';

      headings.forEach(heading => {
        const headingElement = heading as HTMLHeadingElement;
        const level = parseInt(headingElement.tagName.substring(1));

        const item = document.createElement('li');
        item.style.marginBottom = '8px';
        item.style.marginLeft = `${(level - 1) * 15}px`;

        const link = document.createElement('a');

        // Create an ID for the heading if it doesn't have one
        if (!headingElement.id) {
          headingElement.id = `heading-${Math.random().toString(36).substring(2, 9)}`;
        }

        link.href = `#${headingElement.id}`;
        link.textContent = headingElement.textContent || '';
        link.style.color = '#0066cc';
        link.style.textDecoration = 'none';
        link.style.fontSize = '14px';
        link.style.display = 'block';
        link.style.padding = '6px 10px';
        link.style.borderRadius = '4px';
        link.style.backgroundColor = '#f8f8f8';
        link.style.transition = 'background-color 0.2s';

        link.addEventListener('mouseover', () => {
          link.style.backgroundColor = '#e8e8e8';
        });

        link.addEventListener('mouseout', () => {
          link.style.backgroundColor = '#f8f8f8';
        });

        // Add click event to scroll to the heading
        link.addEventListener('click', (e) => {
          e.preventDefault();
          headingElement.scrollIntoView({ behavior: 'smooth' });

          // Briefly highlight the heading
          const originalBg = headingElement.style.backgroundColor;
          headingElement.style.backgroundColor = 'yellow';
          setTimeout(() => {
            headingElement.style.backgroundColor = originalBg;
          }, 2000);
        });

        item.appendChild(link);
        list.appendChild(item);
      });

      container.appendChild(heading);
      container.appendChild(list);
    } else {
      const noHeadings = document.createElement('p');
      noHeadings.textContent = t.noHeadings;
      noHeadings.style.color = '#666';
      noHeadings.style.fontStyle = 'italic';

      container.appendChild(heading);
      container.appendChild(noHeadings);
    }

    return container;
  }

  // Helper function to build skip links
  function buildSkipLinks() {
    const container = document.createElement('div');

    const heading = document.createElement('h3');
    heading.textContent = t.skipLinksTitle;
    heading.style.fontSize = '16px';
    heading.style.margin = '0 0 15px 0';
    heading.style.fontWeight = 'bold';

    const skipTargets = [
      { name: t.skipToMain, target: 'main, [role="main"], article, .content, #content, #main' },
      { name: t.skipToNav, target: 'nav, [role="navigation"], .navigation, #navigation, header, .header, #header' },
      { name: t.skipToSearch, target: 'form[role="search"], [aria-label="search"], .search, #search' },
      { name: t.skipToFooter, target: 'footer, [role="contentinfo"], .footer, #footer' },
      { name: t.skipToTop, target: 'body' }
    ];

    const list = document.createElement('ul');
    list.style.listStyleType = 'none';
    list.style.padding = '0';
    list.style.margin = '0';

    let hasTargets = false;

    skipTargets.forEach(skipTarget => {
      const target = document.querySelector(skipTarget.target);

      if (target && !target.closest('[data-accessibility-widget]')) {
        hasTargets = true;

        const item = document.createElement('li');
        item.style.marginBottom = '10px';

        const link = document.createElement('a');

        // Create an ID for the target if it doesn't have one
        if (!target.id) {
          target.id = `skip-${Math.random().toString(36).substring(2, 9)}`;
        }

        link.href = `#${target.id}`;
        link.textContent = skipTarget.name;
        link.style.color = '#0066cc';
        link.style.textDecoration = 'none';
        link.style.fontSize = '14px';
        link.style.display = 'block';
        link.style.padding = '10px 15px';
        link.style.borderRadius = '4px';
        link.style.backgroundColor = '#f0f0f0';
        link.style.transition = 'background-color 0.2s';
        link.style.fontWeight = 'bold';

        link.addEventListener('mouseover', () => {
          link.style.backgroundColor = '#e0e0e0';
        });

        link.addEventListener('mouseout', () => {
          link.style.backgroundColor = '#f0f0f0';
        });

        // Add click event to scroll to the target
        link.addEventListener('click', (e) => {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });

          // Set focus to the target
          if (target instanceof HTMLElement) {
            target.setAttribute('tabindex', '-1');
            target.focus();

            // Briefly highlight the target
            const originalBg = target.style.backgroundColor;
            target.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
            setTimeout(() => {
              target.style.backgroundColor = originalBg;
            }, 2000);
          }
        });

        item.appendChild(link);
        list.appendChild(item);
      }
    });

    container.appendChild(heading);

    if (hasTargets) {
      container.appendChild(list);
    } else {
      const noTargets = document.createElement('p');
      noTargets.textContent = t.noTargets;
      noTargets.style.color = '#666';
      noTargets.style.fontStyle = 'italic';
      container.appendChild(noTargets);
    }

    return container;
  }

  // Helper function to build landmarks
  function buildLandmarks() {
    const container = document.createElement('div');

    const heading = document.createElement('h3');
    heading.textContent = t.landmarksTitle;
    heading.style.fontSize = '16px';
    heading.style.margin = '0 0 15px 0';
    heading.style.fontWeight = 'bold';

const landmarks = Array.from(document.querySelectorAll(
      'main, [role="main"], header, [role="banner"], nav, [role="navigation"], ' +
      'aside, [role="complementary"], footer, [role="contentinfo"], ' +
      '[role="search"], [role="form"], section[aria-label], section[aria-labelledby]'
    )).filter(el => !el.closest('[data-accessibility-widget]'));

    if (landmarks.length > 0) {
      const list = document.createElement('ul');
      list.style.listStyleType = 'none';
      list.style.padding = '0';
      list.style.margin = '0';

      landmarks.forEach(landmark => {
        const item = document.createElement('li');
        item.style.marginBottom = '10px';

        // Determine the role and label of the landmark
        let role = landmark.getAttribute('role');
        if (!role) {
          switch (landmark.tagName.toLowerCase()) {
            case 'main': role = 'main'; break;
            case 'header': role = 'banner'; break;
            case 'nav': role = 'navigation'; break;
            case 'aside': role = 'complementary'; break;
            case 'footer': role = 'contentinfo'; break;
            default: role = 'region';
          }
        }

        let label = landmark.getAttribute('aria-label') ||
          (landmark.getAttribute('aria-labelledby') ?
            document.getElementById(landmark.getAttribute('aria-labelledby') || '')?.textContent : '');

        if (!label) {
          // Try to find a heading element inside
          const headingEl = landmark.querySelector('h1, h2, h3, h4, h5, h6');
          if (headingEl) {
            label = headingEl.textContent;
          } else {
            label = role.charAt(0).toUpperCase() + role.slice(1);
          }
        }

        const link = document.createElement('a');

        // Create an ID for the landmark if it doesn't have one
        if (!landmark.id) {
          landmark.id = `landmark-${Math.random().toString(36).substring(2, 9)}`;
        }

        link.href = `#${landmark.id}`;
        link.innerHTML = `<strong>${role}:</strong> ${label}`;
        link.style.color = '#0066cc';
        link.style.textDecoration = 'none';
        link.style.fontSize = '14px';
        link.style.display = 'block';
        link.style.padding = '8px 12px';
        link.style.borderRadius = '4px';
        link.style.backgroundColor = '#f5f5f5';
        link.style.transition = 'background-color 0.2s';

        link.addEventListener('mouseover', () => {
          link.style.backgroundColor = '#e5e5e5';

          // Highlight the landmark on hover
          if (landmark instanceof HTMLElement) {
            landmark.dataset.originalOutline = landmark.style.outline;
            landmark.style.outline = '2px solid #0066cc';
          }
        });

        link.addEventListener('mouseout', () => {
          link.style.backgroundColor = '#f5f5f5';

          // Remove highlight on mouseout
          if (landmark instanceof HTMLElement) {
            landmark.style.outline = landmark.dataset.originalOutline || '';
          }
        });

        // Add click event to scroll to the landmark
        link.addEventListener('click', (e) => {
          e.preventDefault();
          landmark.scrollIntoView({ behavior: 'smooth' });

          // Set focus to the landmark
          if (landmark instanceof HTMLElement) {
            landmark.setAttribute('tabindex', '-1');
            landmark.focus();
          }
        });

        item.appendChild(link);
        list.appendChild(item);
      });

      container.appendChild(heading);
      container.appendChild(list);
    } else {
      const noLandmarks = document.createElement('p');
      noLandmarks.textContent = t.noLandmarks;
      noLandmarks.style.color = '#666';
      noLandmarks.style.fontStyle = 'italic';

      container.appendChild(heading);
      container.appendChild(noLandmarks);
    }

    return container;
  }

  // Helper function to build headings
  function buildHeadings() {
    const container = document.createElement('div');

    const heading = document.createElement('h3');
    heading.textContent = t.headingsTitle;
    heading.style.fontSize = '16px';
    heading.style.margin = '0 0 15px 0';
    heading.style.fontWeight = 'bold';

    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
      .filter(el => !el.closest('[data-accessibility-widget]'));

    if (headings.length > 0) {
      const list = document.createElement('ul');
      list.style.listStyleType = 'none';
      list.style.padding = '0';
      list.style.margin = '0';

      headings.forEach(headingEl => {
        const level = parseInt(headingEl.tagName.substring(1));

        const item = document.createElement('li');
        item.style.marginBottom = '5px';

        const link = document.createElement('a');

        // Create an ID for the heading if it doesn't have one
        if (!headingEl.id) {
          headingEl.id = `heading-${Math.random().toString(36).substring(2, 9)}`;
        }

        link.href = `#${headingEl.id}`;
        link.textContent = headingEl.textContent || '';
        link.style.color = '#333';
        link.style.textDecoration = 'none';
        link.style.fontSize = '14px';
        link.style.display = 'block';
        link.style.padding = '4px 8px';
        link.style.paddingLeft = `${(level - 1) * 15 + 8}px`;
        link.style.borderLeft = level === 1 ? '3px solid #0066cc' : 
                               level === 2 ? '2px solid #0066cc' : '1px solid #0066cc';
        link.style.backgroundColor = level === 1 ? '#f0f0f0' : 'transparent';
        link.style.transition = 'background-color 0.2s';

        // Add level indicator
        const levelIndicator = document.createElement('span');
        levelIndicator.textContent = `H${level}: `;
        levelIndicator.style.color = '#666';
        levelIndicator.style.marginRight = '5px';
        levelIndicator.style.fontSize = '12px';

        link.prepend(levelIndicator);

        link.addEventListener('mouseover', () => {
          link.style.backgroundColor = '#f0f0f0';
        });

        link.addEventListener('mouseout', () => {
          link.style.backgroundColor = level === 1 ? '#f0f0f0' : 'transparent';
        });

        // Add click event to scroll to the heading
        link.addEventListener('click', (e) => {
          e.preventDefault();
          headingEl.scrollIntoView({ behavior: 'smooth' });

          // Briefly highlight the heading
          const originalBg = headingEl.style.backgroundColor;
          headingEl.style.backgroundColor = 'yellow';
          setTimeout(() => {
            headingEl.style.backgroundColor = originalBg;
          }, 2000);
        });

        item.appendChild(link);
        list.appendChild(item);
      });

      container.appendChild(heading);
      container.appendChild(list);
    } else {
      const noHeadings = document.createElement('p');
      noHeadings.textContent = t.noHeadingsFound;
      noHeadings.style.color = '#666';
      noHeadings.style.fontStyle = 'italic';

      container.appendChild(heading);
      container.appendChild(noHeadings);
    }

    return container;
  }

  // Helper function to build breadcrumbs
  function buildBreadcrumbs() {
    const container = document.createElement('div');

    // Try to find existing breadcrumbs
    const existingBreadcrumbs = document.querySelector('.breadcrumbs, .breadcrumb, [aria-label="breadcrumb"], [role="navigation"][aria-label*="breadcrumb"]');

    if (existingBreadcrumbs) {
      // Clone existing breadcrumbs
      const breadcrumbsClone = existingBreadcrumbs.cloneNode(true);
      container.appendChild(breadcrumbsClone);
    } else {
      // Create simple breadcrumbs based on URL
      const pathParts = window.location.pathname.split('/').filter(Boolean);

      if (pathParts.length > 0) {
        const breadcrumbsList = document.createElement('ol');
        breadcrumbsList.style.listStyleType = 'none';
        breadcrumbsList.style.padding = '0';
        breadcrumbsList.style.margin = '0';
        breadcrumbsList.style.display = 'flex';
        breadcrumbsList.style.flexWrap = 'wrap';
        breadcrumbsList.style.alignItems = 'center';

        // Home link
        const homeItem = document.createElement('li');

        const homeLink = document.createElement('a');
        homeLink.href = '/';
        homeLink.textContent = language === 'en' ? 'Home' : 
                              language === 'de' ? 'Startseite' : 
                              language === 'fr' ? 'Accueil' : 'Inicio';
        homeLink.style.color = '#0066cc';
        homeLink.style.textDecoration = 'none';
        homeLink.style.fontSize = '14px';

        homeItem.appendChild(homeLink);
        breadcrumbsList.appendChild(homeItem);

        // Path parts
        let currentPath = '';

        pathParts.forEach((part, index) => {
          // Add separator
          const separator = document.createElement('li');
          separator.innerHTML = '&nbsp;&rsaquo;&nbsp;';
          separator.style.color = '#666';
          separator.style.margin = '0 5px';

          breadcrumbsList.appendChild(separator);

          // Add path part
          const item = document.createElement('li');

          currentPath += `/${part}`;

          if (index === pathParts.length - 1) {
            // Last item (current page)
            const span = document.createElement('span');
            span.textContent = part
              .replace(/-/g, ' ') // Replace hyphens with spaces
              .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
            span.style.fontWeight = 'bold';

            item.appendChild(span);
          } else {
            // Navigation item
            const link = document.createElement('a');
            link.href = currentPath;
            link.textContent = part
              .replace(/-/g, ' ') // Replace hyphens with spaces
              .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
            link.style.color = '#0066cc';
            link.style.textDecoration = 'none';
            link.style.fontSize = '14px';

            item.appendChild(link);
          }

          breadcrumbsList.appendChild(item);
        });

        container.appendChild(breadcrumbsList);
      } else {
        // Homepage
        const homeText = document.createElement('span');
        homeText.textContent = t.homePage;
        homeText.style.color = '#666';
        homeText.style.fontStyle = 'italic';
        homeText.style.fontSize = '14px';

        container.appendChild(homeText);
      }
    }

    return container;
  }

  // Helper function to build page structure
  function buildPageStructure() {
    const container = document.createElement('div');

    const structureMap = document.createElement('div');
    structureMap.style.border = '1px solid #ddd';
    structureMap.style.borderRadius = '4px';
    structureMap.style.padding = '10px';
    structureMap.style.backgroundColor = '#f9f9f9';
    structureMap.style.position = 'relative';
    structureMap.style.height = '200px';

    // Identify key sections of the page for visualization
    const visibleArea = document.createElement('div');
    visibleArea.style.position = 'absolute';
    visibleArea.style.top = '0';
    visibleArea.style.right = '0';
    visibleArea.style.bottom = '0';
    visibleArea.style.left = '0';
    visibleArea.style.border = '2px dashed #999';
    visibleArea.style.margin = '10px';
    visibleArea.style.borderRadius = '2px';
    visibleArea.style.overflow = 'hidden';

    // Header/Banner
    const hasHeader = document.querySelector('header, [role="banner"]');
    if (hasHeader) {
      const headerEl = document.createElement('div');
      headerEl.textContent = t.header;
      headerEl.style.backgroundColor = '#c5e1ff';
      headerEl.style.padding = '5px';
      headerEl.style.textAlign = 'center';
      headerEl.style.fontWeight = 'bold';
      headerEl.style.fontSize = '12px';
      headerEl.style.height = '15%';
      headerEl.style.borderBottom = '1px solid #aaa';

      visibleArea.appendChild(headerEl);
    }

    // Main content container
    const mainContainer = document.createElement('div');
    mainContainer.style.display = 'flex';
    mainContainer.style.height = hasHeader ? '70%' : '85%';

    // Navigation
    const hasNav = document.querySelector('nav, [role="navigation"]');
    if (hasNav) {
      const navEl = document.createElement('div');
      navEl.textContent = t.navigation;
      navEl.style.backgroundColor = '#ffe6c5';
      navEl.style.padding = '5px';
      navEl.style.textAlign = 'center';
      navEl.style.fontWeight = 'bold';
      navEl.style.fontSize = '12px';
      navEl.style.width = '20%';
      navEl.style.borderRight = '1px solid #aaa';

      mainContainer.appendChild(navEl);
    }

    // Main content
    const mainContent = document.createElement('div');
    mainContent.textContent = t.main;
    mainContent.style.backgroundColor = '#e1ffc5';
    mainContent.style.padding = '5px';
    mainContent.style.textAlign = 'center';
    mainContent.style.fontWeight = 'bold';
    mainContent.style.fontSize = '12px';
    mainContent.style.flex = '1';

    // Check for multiple columns
    const possibleColumns = document.querySelectorAll('.column, .col, [class*="col-"], [class*="column-"]');
    if (possibleColumns.length > 1) {
      mainContent.textContent = t.columns;
      mainContent.style.display = 'flex';

      for (let i = 0; i < Math.min(3, possibleColumns.length); i++) {
        const column = document.createElement('div');
        column.textContent = `${t.column} ${i+1}`;
        column.style.flex = '1';
        column.style.border = '1px dashed #aaa';
        column.style.margin = '2px';
        column.style.fontSize = '10px';

        mainContent.appendChild(column);
      }
    }

    mainContainer.appendChild(mainContent);

    // Sidebar/Complementary content
    const hasAside = document.querySelector('aside, [role="complementary"]');
    if (hasAside) {
      const asideEl = document.createElement('div');
      asideEl.textContent = t.sidebar;
      asideEl.style.backgroundColor = '#ffc5e1';
      asideEl.style.padding = '5px';
      asideEl.style.textAlign = 'center';
      asideEl.style.fontWeight = 'bold';
      asideEl.style.fontSize = '12px';
      asideEl.style.width = '20%';
      asideEl.style.borderLeft = '1px solid #aaa';

      mainContainer.appendChild(asideEl);
    }

    visibleArea.appendChild(mainContainer);

    // Footer
    const hasFooter = document.querySelector('footer, [role="contentinfo"]');
    if (hasFooter) {
      const footerEl = document.createElement('div');
      footerEl.textContent = t.footer;
      footerEl.style.backgroundColor = '#e6e6e6';
      footerEl.style.padding = '5px';
      footerEl.style.textAlign = 'center';
      footerEl.style.fontWeight = 'bold';
      footerEl.style.fontSize = '12px';
      footerEl.style.height = '15%';
      footerEl.style.borderTop = '1px solid #aaa';

      visibleArea.appendChild(footerEl);
    }

    // Viewport indicator
    const viewport = document.createElement('div');
    viewport.textContent = t.currentView;
    viewport.style.position = 'absolute';
    viewport.style.border = '2px solid red';
    viewport.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
    viewport.style.padding = '2px';
    viewport.style.fontSize = '10px';
    viewport.style.color = 'red';
    viewport.style.fontWeight = 'bold';
    viewport.style.width = '70%';
    viewport.style.height = '30%';
    viewport.style.left = '15%';
    viewport.style.top = '30%';
    viewport.style.pointerEvents = 'none';

    structureMap.appendChild(visibleArea);
    structureMap.appendChild(viewport);

    // Create scrolling effect on hover for the structure map
    structureMap.addEventListener('mousemove', (e) => {
      const rect = structureMap.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentY = (y / rect.height) * 100;

      // Move the viewport indicator to show current view
      if (percentY < 25) {
        viewport.style.top = '10%';
      } else if (percentY > 75) {
        viewport.style.top = '60%';
      } else {
        viewport.style.top = '30%';
      }
    });

    container.appendChild(structureMap);

    return container;
  }
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
  let cursorSize = '32px';
  if (settings.cursorSize === 'big') {
    cursorSize = '48px';
  } else if (settings.cursorSize === 'bigger') {
    cursorSize = '64px';
  } else if (settings.cursorSize === 'biggest') {
    cursorSize = '80px';
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
  cursorElement.style.transform = 'translate(0, 0)';
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
    // Only show cursor if not over the accessibility widget
    const target = e.target as HTMLElement;
    const isOverWidget = target.closest('[data-accessibility-widget]');

    // Adjust position to offset the cursor correctly (point at top-left of the cursor)
    const cursorWidth = parseInt(cursor.querySelector('svg')?.getAttribute('width') || '32', 10);
    const cursorHeight = parseInt(cursor.querySelector('svg')?.getAttribute('height') || '32', 10);

    if (isOverWidget) {
      cursor.style.display = 'none';
    } else {
      cursor.style.display = 'block';
      cursor.style.left = `${e.clientX - 2}px`;
      cursor.style.top = `${e.clientY - 2}px`;
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
export function applyAccessibilityStyles(settings: AccessibilitySettings): void {
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
      showVirtualKeyboard();
    }
  } else {
    // Remove virtual keyboard
    hideVirtualKeyboard();
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
// This file corrects a typo in the Array.from calls within the accessibility helpers.