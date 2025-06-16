/**
 * Embeddable Accessibility Widget Script
 * This script can be included on any website to add the accessibility widget.
 */

(function() {
  // Configuration options that can be passed in from the script tag
  const DEFAULT_CONFIG = {
    position: 'bottom-right', // Options: 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    language: 'de',           // Default language
    color: '#0055A4',         // Primary color
    apiEndpoint: 'https://accessible-widget-vv-2-dobro-de.replit.app', // API endpoint for analytics and settings
    widgetLogo: '',           // Custom logo URL
    tokenId: ''               // Client identification token
  };

  // Get script tag and extract configuration
  const scripts = document.getElementsByTagName('script');
  const currentScript = scripts[scripts.length - 1];
  
  // Extract configuration from data attributes
  const config = { ...DEFAULT_CONFIG };
  for (const key in DEFAULT_CONFIG) {
    if (currentScript.dataset[key]) {
      config[key as keyof typeof DEFAULT_CONFIG] = currentScript.dataset[key];
    }
  }

  // Function to load CSS
  function loadStyles() {
    const styleTag = document.createElement('style');
    styleTag.textContent = 
      '#accessibility-widget-container * {' +
      '  box-sizing: border-box;' +
      '  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;' +
      '}' +
      
      '#accessibility-widget-button {' +
      '  position: fixed;' +
      '  z-index: 9998;' +
      '  width: 48px;' +
      '  height: 48px;' +
      '  border-radius: 50%;' +
      '  background-color: ' + config.color + ';' +
      '  color: white;' +
      '  border: none;' +
      '  display: flex;' +
      '  align-items: center;' +
      '  justify-content: center;' +
      '  cursor: pointer;' +
      '  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);' +
      '  transition: all 0.3s ease;' +
      '}' +
      
      '#accessibility-widget-button:hover {' +
      '  transform: scale(1.1);' +
      '  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.25);' +
      '}' +
      
      '#accessibility-widget-button svg {' +
      '  width: 28px;' +
      '  height: 28px;' +
      '}' +
      
      '/* Position Variants */' +
      '#accessibility-widget-button.bottom-right {' +
      '  bottom: 20px;' +
      '  right: 20px;' +
      '}' +
      
      '#accessibility-widget-button.bottom-left {' +
      '  bottom: 20px;' +
      '  left: 20px;' +
      '}' +
      
      '#accessibility-widget-button.top-right {' +
      '  top: 20px;' +
      '  right: 20px;' +
      '}' +
      
      '#accessibility-widget-button.top-left {' +
      '  top: 20px;' +
      '  left: 20px;' +
      '}' +
      
      '/* Widget panel styles will be loaded from the iframe */';
    document.head.appendChild(styleTag);
  }

  // Widget button HTML with SVG icon
  function createWidgetButton() {
    const container = document.createElement('div');
    container.id = 'accessibility-widget-container';
    
    const button = document.createElement('button');
    button.id = 'accessibility-widget-button';
    button.className = config.position;
    button.setAttribute('aria-label', 'Open accessibility menu');
    button.setAttribute('type', 'button');
    
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4M12 16h.01"></path>
      </svg>
    `;
    
    container.appendChild(button);
    document.body.appendChild(container);
    
    return button;
  }

  // Create iframe to load the widget panel
  function createWidgetIframe() {
    const iframe = document.createElement('iframe');
    iframe.id = 'accessibility-widget-iframe';
    iframe.style.position = 'fixed';
    iframe.style.zIndex = '9999';
    iframe.style.border = 'none';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.transition = 'opacity 0.3s ease';
    
    // Position the iframe based on configuration
    switch(config.position) {
      case 'bottom-right':
        iframe.style.bottom = '80px';
        iframe.style.right = '20px';
        break;
      case 'bottom-left':
        iframe.style.bottom = '80px';
        iframe.style.left = '20px';
        break;
      case 'top-right':
        iframe.style.top = '80px';
        iframe.style.right = '20px';
        break;
      case 'top-left':
        iframe.style.top = '80px';
        iframe.style.left = '20px';
        break;
    }
    
    document.body.appendChild(iframe);
    return iframe;
  }

  // Initialize the widget
  let button: HTMLButtonElement; // Deklariere button außerhalb von initWidget
  let iframe: HTMLIFrameElement; // Deklariere iframe außerhalb von initWidget

  function initWidget() {
    // Load the styles
    loadStyles();
    
    // Create button and iframe elements
    button = createWidgetButton(); // Zuweisung zu der deklarierten Variable
    iframe = createWidgetIframe(); // Zuweisung zu der deklarierten Variable
    
    // Set iframe src after creating element (prevents flicker)
    const iframeSrc = new URL(config.apiEndpoint + '/widget-embed');
    Object.keys(config).forEach(key => {
      iframeSrc.searchParams.append(key, String(config[key as keyof typeof config]));
    });
    iframe.src = iframeSrc.toString();
    
    // Widget state
    let isOpen = false;
    
    // Toggle widget panel
    function toggleWidget() {
      isOpen = !isOpen;
      console.log(`Debug: Parent toggleWidget called. Setting isOpen to ${isOpen}.`);

      if (isOpen) {
        iframe.style.display = 'block'; // Set display to block before setting opacity
        // Delay setting opacity to allow display change to register
        setTimeout(() => {
          iframe.style.width = '340px';
          iframe.style.height = '500px';
          iframe.style.opacity = '1';
          iframe.style.pointerEvents = 'auto';
        }, 10); // Small delay
        button.setAttribute('aria-expanded', 'true');
      } else {
        iframe.style.opacity = '0';
        // Delay setting display to none to allow opacity transition
        setTimeout(() => {
          iframe.style.display = 'none'; // Hide it completely
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.pointerEvents = 'none';
        }, 300); // Corresponds to the transition duration
        button.setAttribute('aria-expanded', 'false');
      }
      
      // Notify iframe that widget state changed
      iframe.contentWindow?.postMessage({
        type: 'accessibility-widget-toggle',
        isOpen
      }, '*');
    }
    
    // Button click handler
    button.addEventListener('click', toggleWidget);
    
    // Setup cross-window communication
    window.addEventListener('message', (event: MessageEvent) => {
      console.log('Debug: Message received in parent window:', event.data);
      // Überprüfen, ob die Nachricht von der erwarteten Quelle stammt (optional, aber empfohlen)
      // Hier verwenden wir '*' als origin, aber in einer Produktionsumgebung sollte event.origin überprüft werden

      if (event.data.type === 'accessibility-widget-closed') {
        console.log('Debug: Received widget-closed message from iframe. Hiding iframe.');
        isOpen = false; // Zustand im übergeordneten Skript aktualisieren
        iframe.style.opacity = '0';
        setTimeout(() => {
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.pointerEvents = 'none';
        }, 300); // Entspricht der Transition-Dauer im iframe
        button.setAttribute('aria-expanded', 'false');
      } else if (event.data.type === 'accessibility-widget-toggle') {
        // Dies ist der bereits vorhandene Listener für Toggle-Nachrichten
        isOpen = event.data.isOpen;
        console.log(`Debug: Message listener in parent processed accessibility-widget-toggle. isOpen: ${isOpen}`);

        if (isOpen) {
          iframe.style.display = 'block'; // Set display to block before setting opacity
          // Delay setting opacity to allow display change to register
          setTimeout(() => {
            iframe.style.width = '340px';
            iframe.style.height = '500px';
            iframe.style.opacity = '1';
            iframe.style.pointerEvents = 'auto';
          }, 10); // Small delay
          button.setAttribute('aria-expanded', 'true');
        } else {
          iframe.style.opacity = '0';
          // Delay setting display to none to allow opacity transition
          setTimeout(() => {
            iframe.style.display = 'none'; // Hide it completely
            iframe.style.width = '0';
            iframe.style.height = '0';
            iframe.style.pointerEvents = 'none';
          }, 300); // Corresponds to the transition duration
          button.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  // Apply accessibility styles to the host page
  // Note: These functions are simplified for the embed script.
  // Full accessibility logic resides within the iframe's React app.
  function applyAccessibilityStyles(settings: any) { // Type 'any' for simplicity in embed script
    const styleTag = document.getElementById('accessibility-styles') as HTMLStyleElement || document.createElement('style');
    styleTag.id = 'accessibility-styles';
    let css = '';

    // Remove existing styles to prevent duplication
    if (styleTag.parentNode) {
      styleTag.parentNode.removeChild(styleTag);
    }

    // Text size adjustments
    if (settings.textSize !== 0) {
      const textSizePercent = 100 + (settings.textSize * 10);
      css += `html { font-size: ${textSizePercent}% !important; }`;
    }

    // Line height adjustments
    if (settings.lineHeight !== 0) {
      const lineHeightEm = 1.6 + (settings.lineHeight * 0.2);
      css += `body, p, li, h1, h2, h3, h4, h5, h6 { line-height: ${lineHeightEm}em !important; }`;
    }

    // Letter spacing adjustments
    if (settings.letterSpacing !== 0) {
      const letterSpacingPx = settings.letterSpacing * 1;
      css += `body, p, li, h1, h2, h3, h4, h5, h6 { letter-spacing: ${letterSpacingPx}px !important; }`;
    }

    // Word spacing adjustments
    if (settings.wordSpacing !== 0) {
      const wordSpacingPx = settings.wordSpacing * 1;
      css += `body, p, li { word-spacing: ${wordSpacingPx}px !important; }`;
    }

    // Contrast mode adjustments
    if (settings.contrastMode === 'increased') {
      css += `html { filter: contrast(1.2) !important; }`;
    } else if (settings.contrastMode === 'high') {
      css += `html { filter: contrast(1.5) !important; }`;
    } else if (settings.contrastMode === 'dark') {
      css += `html { filter: invert(1) hue-rotate(180deg) !important; background-color: #000 !important; } img, video { filter: invert(1) hue-rotate(180deg) !important; }`;
    } else if (settings.contrastMode === 'light') {
      css += `html { filter: contrast(0.8) !important; }`;
    }

    // Saturation and monochrome filters
    if (settings.saturation !== 100 || settings.monochrome > 0) {
      const filterValues = [];
      if (settings.saturation !== 100) {
        filterValues.push(`saturate(${settings.saturation}%)`);
      }
      if (settings.monochrome > 0) {
        filterValues.push(`grayscale(${settings.monochrome}%)`);
      }
      css += `html, img, video { filter: ${filterValues.join(' ')} !important; }`;
    }

    // Text color adjustments
    if (settings.textColor !== 'default') {
      css += `body, p, li, span, div, a:not([data-accessibility-widget]), button:not([data-accessibility-widget]) { color: ${settings.textColor} !important; }`;
    }

    // Title color adjustments
    if (settings.titleColor !== 'default') {
      css += `h1, h2, h3, h4, h5, h6 { color: ${settings.titleColor} !important; }`;
    }

    // Background color adjustments
    if (settings.backgroundColor !== 'default') {
      css += `body { background-color: ${settings.backgroundColor} !important; }`;
    }

    // Dark mode
    if (settings.darkMode) {
      css += `body { background-color: #1a1a1a !important; color: #f0f0f0 !important; } h1, h2, h3, h4, h5, h6 { color: #f0f0f0 !important; } a { color: #8ab4f8 !important; } a:visited { color: #c58af9 !important; }`;
    }

    // Hide images
    if (settings.hideImages) {
      css += `img, picture, svg, video, canvas, [style*="background-image"] { opacity: 0.01 !important; }`;
    }

    // Stop animations
    if (settings.stopAnimations) {
      css += `*, *::before, *::after { animation: none !important; transition: none !important; scroll-behavior: auto !important; }`;
    }

    // Highlight titles
    if (settings.highlightTitles) {
      css += `h1, h2, h3, h4, h5, h6 { background-color: rgba(255, 255, 0, 0.3) !important; padding: 2px 5px !important; border-radius: 3px !important; }`;
    }

    // Highlight links
    if (settings.highlightLinks) {
      css += `a { text-decoration: underline !important; font-weight: bold !important; color: #0000EE !important; background-color: rgba(255, 255, 0, 0.3) !important; } a:visited { color: #551A8B !important; }`;
    }

    // Highlight focus
    if (settings.highlightFocus) {
      css += `:focus { outline: 3px solid #2196F3 !important; outline-offset: 3px !important; }`;
    }

    // Font family adjustments
    if (settings.fontFamily === 'readable') {
      css += `body, p, li, h1, h2, h3, h4, h5, h6 { font-family: 'Arial', sans-serif !important; }`;
    } else if (settings.fontFamily === 'dyslexic') {
      css += `body, p, li, h1, h2, h3, h4, h5, h6 { font-family: 'Open Dyslexic', sans-serif !important; }`;
    }

    // Text align adjustments
    if (settings.textAlign !== 'default') {
      css += `body, p, li { text-align: ${settings.textAlign} !important; }`;
    }

    styleTag.textContent = css;
    document.head.appendChild(styleTag);
  }

  // Reset accessibility styles
  function resetAccessibilityStyles() {
    const styleTag = document.getElementById('accessibility-styles');
    if (styleTag) {
      styleTag.textContent = '';
    }
  }

  // Update a single accessibility setting
  function updateAccessibilitySetting(setting: any, value: any) { // Type 'any' for simplicity in embed script
    console.log(`Debug: External script received setting update: ${setting} = ${value}`);
  }

  // Enable keyboard navigation (dummy implementation for now)
  function enableKeyboardNavigation() {
    console.log("Debug: Keyboard navigation enabled.");
    const navHelpers = document.createElement('div');
    navHelpers.id = 'keyboard-nav-helpers';
    navHelpers.textContent = 'Keyboard Navigation Enabled';
    document.body.appendChild(navHelpers);
  }

  // Disable keyboard navigation (dummy implementation for now)
  function disableKeyboardNavigation() {
    console.log("Debug: Keyboard navigation disabled.");
    const navHelpers = document.getElementById('keyboard-nav-helpers');
    if (navHelpers) {
      navHelpers.remove();
    }
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();