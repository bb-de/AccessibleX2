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
      config[key] = currentScript.dataset[key];
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
  function initWidget() {
    // Load the styles
    loadStyles();
    
    // Create button and iframe elements
    const button = createWidgetButton();
    const iframe = createWidgetIframe();
    
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
      
      if (isOpen) {
        iframe.style.width = '340px';
        iframe.style.height = '500px';
        iframe.style.opacity = '1';
        iframe.style.pointerEvents = 'auto';
        button.setAttribute('aria-expanded', 'true');
      } else {
        iframe.style.opacity = '0';
        setTimeout(() => {
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.pointerEvents = 'none';
        }, 300);
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
    window.addEventListener('message', (event) => {
      // Only accept messages from our iframe
      if (event.source !== iframe.contentWindow) {
        return;
      }
      
      const { type, data } = event.data;
      
      switch (type) {
        case 'accessibility-widget-ready':
          // Widget has loaded in iframe
          console.log('Accessibility widget ready');
          break;
          
        case 'accessibility-widget-close':
          // Close widget when requested from iframe
          if (isOpen) {
            toggleWidget();
          }
          break;
          
        case 'accessibility-widget-profile-applied':
          // Apply accessibility changes to host page
          applyAccessibilityStyles(data.profileSettings);
          break;
          
        case 'accessibility-widget-reset':
          // Reset accessibility styles
          resetAccessibilityStyles();
          break;
          
        case 'accessibility-widget-setting-changed':
          // Apply single setting change
          updateAccessibilitySetting(data.setting, data.value);
          break;
      }
    });
  }
  
  // Apply accessibility styles to the host page
  function applyAccessibilityStyles(settings) {
    // Remove existing styles
    resetAccessibilityStyles();
    
    // Create a new style tag
    const styleTag = document.createElement('style');
    styleTag.id = 'accessibility-styles';
    
    // Build CSS based on settings
    let css = '';
    
    // Text size adjustments
    if (settings.textSize !== 0) {
      const textSizePercent = 100 + (settings.textSize * 10);
      css += `
        body, p, div, span, a, li, input, button, textarea, select, label {
          font-size: ${textSizePercent}% !important;
        }
      `;
    }
    
    // Line height adjustments
    if (settings.lineHeight !== 0) {
      const lineHeightValue = 1.5 + (settings.lineHeight * 0.1);
      css += `
        p, div, span, li {
          line-height: ${lineHeightValue} !important;
        }
      `;
    }
    
    // Letter spacing
    if (settings.letterSpacing !== 0) {
      const letterSpacingValue = settings.letterSpacing * 0.5;
      css += `
        body, p, div, span, a, li, input, button, textarea, select, label {
          letter-spacing: ${letterSpacingValue}px !important;
        }
      `;
    }
    
    // Dark mode
    if (settings.darkMode) {
      css += `
        html, body {
          background-color: #121212 !important;
          filter: invert(1) hue-rotate(180deg) !important;
        }
        
        img, video, picture, svg, canvas, [style*="background-image"] {
          filter: invert(1) hue-rotate(180deg) !important;
        }
      `;
    }
    
    // Font family
    if (settings.fontFamily !== 'default') {
      let fontFamilyValue = '';
      
      switch (settings.fontFamily) {
        case 'readable':
          fontFamilyValue = 'Arial, sans-serif';
          break;
        case 'dyslexic':
          fontFamilyValue = 'OpenDyslexic, Comic Sans MS, sans-serif';
          // Add OpenDyslexic font if it's not already loaded
          if (!document.getElementById('accessibility-font-dyslexic')) {
            const fontLink = document.createElement('link');
            fontLink.id = 'accessibility-font-dyslexic';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css';
            document.head.appendChild(fontLink);
          }
          break;
      }
      
      if (fontFamilyValue) {
        css += `
          body, p, div, span, a, li, input, button, textarea, select, label {
            font-family: ${fontFamilyValue} !important;
          }
        `;
      }
    }
    
    // Text alignment
    if (settings.textAlign !== 'default') {
      css += `
        p, div, h1, h2, h3, h4, h5, h6 {
          text-align: ${settings.textAlign} !important;
        }
      `;
    }
    
    // High contrast
    if (settings.contrastMode === 'high') {
      css += `
        body, p, div, span, a, li, input, button, textarea, select, label {
          color: white !important;
          background-color: black !important;
        }
        
        a, button {
          color: yellow !important;
          text-decoration: underline !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: white !important;
          background-color: black !important;
        }
      `;
    }
    
    // Highlight links
    if (settings.highlightLinks) {
      css += `
        a {
          text-decoration: underline !important;
          font-weight: bold !important;
          color: #0000EE !important;
          background-color: rgba(255, 255, 0, 0.3) !important;
        }
        
        a:visited {
          color: #551A8B !important;
        }
      `;
    }
    
    // Highlight focus
    if (settings.highlightFocus) {
      css += `
        :focus {
          outline: 3px solid #2196F3 !important;
          outline-offset: 3px !important;
        }
      `;
    }
    
    // Stop animations
    if (settings.stopAnimations) {
      css += `
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
      `;
    }
    
    // Hide images
    if (settings.hideImages) {
      css += `
        img, picture, svg, video, canvas, [style*="background-image"] {
          opacity: 0.01 !important;
        }
      `;
    }

    // Apply styles
    styleTag.textContent = css;
    document.head.appendChild(styleTag);
    
    // Additional non-CSS adjustments here
    if (settings.keyboardNavigation) {
      enableKeyboardNavigation();
    }
  }
  
  // Reset all applied accessibility styles
  function resetAccessibilityStyles() {
    // Remove the accessibility style tag
    const existingStyles = document.getElementById('accessibility-styles');
    if (existingStyles) {
      existingStyles.remove();
    }
    
    // Remove keyboard navigation listeners and elements
    if (document.getElementById('keyboard-nav-helpers')) {
      disableKeyboardNavigation();
    }
    
    // Remove reading mask
    const readingMask = document.getElementById('accessibility-reading-mask');
    if (readingMask) {
      readingMask.remove();
    }
    
    // Remove reading guide
    const readingGuide = document.getElementById('accessibility-reading-guide');
    if (readingGuide) {
      readingGuide.remove();
    }
  }
  
  // Update a single accessibility setting
  function updateAccessibilitySetting(setting, value) {
    // Get the current styles
    let styleTag = document.getElementById('accessibility-styles');
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'accessibility-styles';
      document.head.appendChild(styleTag);
    }
    
    // Handle specific setting changes
    // This is a simplified version, you would need to expand this based on the setting
    switch(setting) {
      case 'textSize':
        // Update text size CSS
        break;
      case 'darkMode':
        // Toggle dark mode
        break;
      // Add other cases as needed
    }
  }
  
  // Basic keyboard navigation implementation
  function enableKeyboardNavigation() {
    // This would be a simplified version of your existing keyboard navigation
    console.log('Keyboard navigation enabled');
    // Add event listeners and visual helpers
  }
  
  function disableKeyboardNavigation() {
    // Remove keyboard navigation helpers
    console.log('Keyboard navigation disabled');
    // Remove event listeners and visual helpers
  }

  // Initialize when the DOM is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();