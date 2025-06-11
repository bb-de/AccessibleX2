import express, { Request, Response } from 'express';

/**
 * Setup Widget API routes for serving the accessibility widget to external sites
 */
export function setupWidgetRoutes(app: express.Express) {
  // Handle CORS preflight requests
  app.options('/widget/*', (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    res.status(200).end();
  });

  // Serve widget script
  app.get('/widget/accessibility.js', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    const widgetCode = `
(function() {
  'use strict';

  // Prevent multiple initialization
  if (window.accessibilityWidgetLoaded) {
    console.log('Accessibility widget already loaded');
    return;
  }

  console.log('Starting accessibility widget initialization...');

  // Get script configuration
  const currentScript = document.currentScript || document.querySelector('script[src*="accessibility.js"]');
  const config = {
    tokenId: currentScript?.getAttribute('data-token-id') || 'default',
    language: currentScript?.getAttribute('data-language') || 'de',
    position: currentScript?.getAttribute('data-position') || 'bottom-right',
    color: currentScript?.getAttribute('data-color') || '#0055A4',
    widgetLogo: currentScript?.getAttribute('data-widget-logo') || null
  };

  console.log('Widget config:', config);

  // Translation object
  const translations = {
    de: {
      title: 'Barrierefreiheit',
      close: 'Schließen',
      profiles: 'Profile',
      vision: 'Sehen',
      navigation: 'Navigation',
      content: 'Inhalte',
      reset: 'Zurücksetzen'
    },
    en: {
      title: 'Accessibility',
      close: 'Close',
      profiles: 'Profiles',
      vision: 'Vision',
      navigation: 'Navigation',
      content: 'Content',
      reset: 'Reset'
    }
  };

  const t = translations[config.language] || translations.de;

  // Create widget styles
  function createStyles() {
    if (document.getElementById('accessibility-widget-styles')) {
      return;
    }

    const styles = document.createElement('style');
    styles.id = 'accessibility-widget-styles';
    styles.textContent = \`
      #accessibility-toggle {
        position: fixed;
        width: 60px;
        height: 60px;
        background: \${config.color};
        border: none;
        border-radius: 50%;
        cursor: pointer;
        z-index: 999999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
      }

      #accessibility-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0,0,0,0.4);
      }

      #accessibility-toggle.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      #accessibility-toggle.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      #accessibility-toggle.top-right {
        top: 20px;
        right: 20px;
      }

      #accessibility-toggle.top-left {
        top: 20px;
        left: 20px;
      }

      #accessibility-panel {
        position: fixed;
        width: 350px;
        max-height: 500px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 12px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        z-index: 999998;
        font-family: Arial, sans-serif;
        overflow: hidden;
        transform: scale(0.8);
        opacity: 0;
        transition: all 0.3s ease;
        pointer-events: none;
      }

      #accessibility-panel.show {
        transform: scale(1);
        opacity: 1;
        pointer-events: auto;
      }

      #accessibility-panel.bottom-right {
        bottom: 90px;
        right: 20px;
      }

      #accessibility-panel.bottom-left {
        bottom: 90px;
        left: 20px;
      }

      #accessibility-panel.top-right {
        top: 90px;
        right: 20px;
      }

      #accessibility-panel.top-left {
        top: 90px;
        left: 20px;
      }

      .widget-header {
        background: \${config.color};
        color: white;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .widget-title {
        font-size: 18px;
        font-weight: bold;
        margin: 0;
      }

      .widget-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s;
      }

      .widget-close:hover {
        background: rgba(255,255,255,0.2);
      }

      .widget-content {
        padding: 20px;
        max-height: 400px;
        overflow-y: auto;
      }

      .widget-section {
        margin-bottom: 20px;
      }

      .widget-section h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #333;
      }

      .widget-button {
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 8px 12px;
        margin: 4px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
      }

      .widget-button:hover {
        background: #e9e9e9;
      }

      .widget-button.active {
        background: \${config.color};
        color: white;
        border-color: \${config.color};
      }

      .widget-reset {
        background: #dc3545;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 15px;
        width: 100%;
        font-size: 14px;
      }

      .widget-reset:hover {
        background: #c82333;
      }

      /* Accessibility enhancements */
      body.high-contrast {
        filter: contrast(150%) !important;
      }

      body.large-text * {
        font-size: 120% !important;
      }

      body.large-text h1 { font-size: 200% !important; }
      body.large-text h2 { font-size: 180% !important; }
      body.large-text h3 { font-size: 160% !important; }

      body.reading-guide {
        position: relative;
      }

      .reading-guide-line {
        position: fixed;
        width: 100%;
        height: 3px;
        background: \${config.color};
        top: 50%;
        left: 0;
        z-index: 999997;
        pointer-events: none;
        opacity: 0.7;
      }

      body.link-highlight a {
        background: yellow !important;
        padding: 2px 4px !important;
        border-radius: 3px !important;
      }

      body.no-animations * {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
      }
    \`;

    document.head.appendChild(styles);
    console.log('Widget styles created');
  }

  // Create widget button
  function createButton() {
    if (document.getElementById('accessibility-toggle')) {
      return;
    }

    const button = document.createElement('button');
    button.id = 'accessibility-toggle';
    button.className = config.position;
    button.innerHTML = '♿';
    button.setAttribute('aria-label', t.title);
    button.setAttribute('title', t.title);

    button.addEventListener('click', togglePanel);
    document.body.appendChild(button);
    console.log('Widget button created');
  }

  // Create widget panel
  function createPanel() {
    if (document.getElementById('accessibility-panel')) {
      return;
    }

    const panel = document.createElement('div');
    panel.id = 'accessibility-panel';
    panel.className = config.position;

    panel.innerHTML = \`
      <div class="widget-header">
        <h2 class="widget-title">\${t.title}</h2>
        <button class="widget-close" onclick="toggleAccessibilityPanel()" aria-label="\${t.close}">×</button>
      </div>
      <div class="widget-content">
        <div class="widget-section">
          <h3>\${t.vision}</h3>
          <button class="widget-button" onclick="toggleHighContrast()" data-feature="high-contrast">Hoher Kontrast</button>
          <button class="widget-button" onclick="toggleLargeText()" data-feature="large-text">Große Schrift</button>
          <button class="widget-button" onclick="toggleReadingGuide()" data-feature="reading-guide">Lesehilfe</button>
        </div>
        <div class="widget-section">
          <h3>\${t.navigation}</h3>
          <button class="widget-button" onclick="toggleLinkHighlight()" data-feature="link-highlight">Links hervorheben</button>
          <button class="widget-button" onclick="toggleNoAnimations()" data-feature="no-animations">Animationen stoppen</button>
        </div>
        <button class="widget-reset" onclick="resetAccessibility()">\${t.reset}</button>
      </div>
    \`;

    document.body.appendChild(panel);
    console.log('Widget panel created');
  }

  // Toggle panel visibility
  function togglePanel() {
    const panel = document.getElementById('accessibility-panel');
    if (panel) {
      panel.classList.toggle('show');
      console.log('Panel toggled');
    }
  }

  // Global functions for panel interactions
  window.toggleAccessibilityPanel = togglePanel;

  window.toggleHighContrast = function() {
    document.body.classList.toggle('high-contrast');
    updateButtonState('high-contrast');
    console.log('High contrast toggled');
  };

  window.toggleLargeText = function() {
    document.body.classList.toggle('large-text');
    updateButtonState('large-text');
    console.log('Large text toggled');
  };

  window.toggleReadingGuide = function() {
    const existing = document.querySelector('.reading-guide-line');
    if (existing) {
      existing.remove();
      document.body.classList.remove('reading-guide');
    } else {
      const line = document.createElement('div');
      line.className = 'reading-guide-line';
      document.body.appendChild(line);
      document.body.classList.add('reading-guide');

      // Move reading guide with mouse
      document.addEventListener('mousemove', function(e) {
        if (document.querySelector('.reading-guide-line')) {
          line.style.top = e.clientY + 'px';
        }
      });
    }
    updateButtonState('reading-guide');
    console.log('Reading guide toggled');
  };

  window.toggleLinkHighlight = function() {
    document.body.classList.toggle('link-highlight');
    updateButtonState('link-highlight');
    console.log('Link highlight toggled');
  };

  window.toggleNoAnimations = function() {
    document.body.classList.toggle('no-animations');
    updateButtonState('no-animations');
    console.log('Animations toggled');
  };

  window.resetAccessibility = function() {
    // Remove all accessibility classes
    document.body.classList.remove('high-contrast', 'large-text', 'reading-guide', 'link-highlight', 'no-animations');

    // Remove reading guide line
    const line = document.querySelector('.reading-guide-line');
    if (line) line.remove();

    // Reset all button states
    document.querySelectorAll('.widget-button').forEach(btn => {
      btn.classList.remove('active');
    });

    console.log('Accessibility settings reset');
  };

  // Update button active state
  function updateButtonState(feature) {
    const button = document.querySelector(\`[data-feature="\${feature}"]\`);
    if (button) {
      button.classList.toggle('active');
    }
  }

  // Keyboard shortcut (Alt + U)
  document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'u') {
      e.preventDefault();
      togglePanel();
    }
  });

  // Close panel when clicking outside
  document.addEventListener('click', function(e) {
    const panel = document.getElementById('accessibility-panel');
    const button = document.getElementById('accessibility-toggle');

    if (panel && button && !panel.contains(e.target) && !button.contains(e.target)) {
      panel.classList.remove('show');
    }
  });

  // Initialize widget
  function initWidget() {
    try {
      console.log('Initializing accessibility widget...');
      createStyles();
      createButton();
      createPanel();

      // Mark as loaded
      window.accessibilityWidgetLoaded = true;
      console.log('Accessibility widget initialized successfully');
    } catch (error) {
      console.error('Error initializing accessibility widget:', error);
    }
  }

  // Multiple initialization strategies
  function tryInitialize() {
    if (document.getElementById('accessibility-toggle')) {
      console.log('Widget already exists');
      return;
    }

    if (document.body) {
      console.log('Body available, initializing widget');
      initWidget();
    } else {
      console.log('Body not available yet, waiting...');
      setTimeout(tryInitialize, 50);
    }
  }

  // Primary initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    // Document already loaded
    tryInitialize();
  }

  // Backup initialization attempts
  setTimeout(() => {
    if (!document.getElementById('accessibility-toggle')) {
      console.log('Widget not found after 500ms, trying again...');
      tryInitialize();
    }
  }, 500);

  setTimeout(() => {
    if (!document.getElementById('accessibility-toggle')) {
      console.log('Widget not found after 1000ms, trying again...');
      tryInitialize();
    }
  }, 1000);

  setTimeout(() => {
    if (!document.getElementById('accessibility-toggle')) {
      console.log('Widget not found after 2000ms, final attempt...');
      tryInitialize();
    }
  }, 2000);

})();
    `;
    
    res.send(widgetCode);
  });

  // Serve widget in iframe format for external sites
  app.get('/widget/iframe', (req: Request, res: Response) => {
    try {
      const { tokenId, language = 'de', position = 'bottom-right', color = '#0055A4' } = req.query;

      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Access-Control-Allow-Origin', '*');

      const iframeHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Accessibility Widget</title>
</head>
<body>
  <script 
    src="${req.protocol}://${req.get('host')}/widget/accessibility.js" 
    data-token-id="${tokenId}" 
    data-language="${language}"
    data-position="${position}"
    data-color="${color}"
  ></script>
</body>
</html>
      `;

      res.send(iframeHtml);
    } catch (error) {
      console.error('Error serving widget iframe:', error);
      res.status(500).send('Error loading widget iframe');
    }
  });
}