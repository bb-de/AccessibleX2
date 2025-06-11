
/**
 * Accessibility Widget - GitHub Pages Version
 * Optimiert für GitHub Pages Deployment
 * Version 2.1.0
 */
(function() {
  'use strict';
  
  // Konfiguration aus Script-Attributen
  const currentScript = document.currentScript;
  const config = {
    position: currentScript?.getAttribute('data-position') || 'bottom-right',
    language: currentScript?.getAttribute('data-language') || 'de',
    color: currentScript?.getAttribute('data-color') || '#0066cc',
    size: currentScript?.getAttribute('data-size') || 'medium',
    // GitHub Pages URL-Basis
    baseUrl: currentScript?.getAttribute('data-base-url') || ''
  };

  // Vollständige CSS-Styles eingebettet
  const COMPLETE_CSS = `
    /* Reset für Widget-Elemente */
    .a11y-widget-container, .a11y-widget-container * {
      box-sizing: border-box !important;
      margin: 0 !important;
      padding: 0 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
      line-height: 1.4 !important;
    }

    /* Widget Button */
    .a11y-widget-button {
      position: fixed !important;
      width: 60px !important;
      height: 60px !important;
      border-radius: 50% !important;
      background: ${config.color} !important;
      color: white !important;
      border: none !important;
      cursor: pointer !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      font-size: 0 !important;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      outline: none !important;
      user-select: none !important;
    }

    .a11y-widget-button:hover {
      transform: scale(1.1) !important;
      box-shadow: 0 6px 20px rgba(0,0,0,0.25) !important;
    }

    .a11y-widget-button:focus {
      outline: 3px solid rgba(255,255,255,0.5) !important;
      outline-offset: 2px !important;
    }

    .a11y-widget-button svg {
      width: 28px !important;
      height: 28px !important;
      fill: currentColor !important;
    }

    /* Widget Panel */
    .a11y-widget-panel {
      position: fixed !important;
      width: 380px !important;
      max-width: 90vw !important;
      max-height: 85vh !important;
      background: #ffffff !important;
      border-radius: 16px !important;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05) !important;
      z-index: 2147483646 !important;
      opacity: 0 !important;
      visibility: hidden !important;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
      overflow: hidden !important;
      font-size: 14px !important;
      color: #333 !important;
      display: flex !important;
      flex-direction: column !important;
    }

    .a11y-widget-panel.visible {
      opacity: 1 !important;
      visibility: visible !important;
      transform: translate(0, 0) scale(1) !important;
    }

    /* Panel Header */
    .a11y-widget-header {
      padding: 20px 24px 16px !important;
      border-bottom: 1px solid #e5e7eb !important;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
    }

    .a11y-widget-title {
      font-size: 18px !important;
      font-weight: 600 !important;
      color: #1f2937 !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }

    .a11y-widget-close {
      background: none !important;
      border: none !important;
      width: 32px !important;
      height: 32px !important;
      border-radius: 8px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      color: #6b7280 !important;
      transition: all 0.2s ease !important;
    }

    .a11y-widget-close:hover {
      background: rgba(0,0,0,0.05) !important;
      color: #374151 !important;
    }

    /* Tabs */
    .a11y-widget-tabs {
      display: flex !important;
      background: #f9fafb !important;
      border-bottom: 1px solid #e5e7eb !important;
    }

    .a11y-widget-tab {
      flex: 1 !important;
      padding: 12px 8px !important;
      border: none !important;
      background: none !important;
      cursor: pointer !important;
      font-size: 12px !important;
      font-weight: 500 !important;
      color: #6b7280 !important;
      transition: all 0.2s ease !important;
      text-align: center !important;
      position: relative !important;
    }

    .a11y-widget-tab:hover {
      color: ${config.color} !important;
      background: rgba(0,102,204,0.05) !important;
    }

    .a11y-widget-tab.active {
      color: ${config.color} !important;
      background: white !important;
    }

    .a11y-widget-tab.active::after {
      content: '' !important;
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 2px !important;
      background: ${config.color} !important;
    }

    .a11y-widget-tab-icon {
      display: block !important;
      margin: 0 auto 4px !important;
      width: 20px !important;
      height: 20px !important;
    }

    /* Content Area */
    .a11y-widget-content {
      flex: 1 !important;
      overflow-y: auto !important;
      padding: 20px 24px !important;
    }

    .a11y-widget-section {
      margin-bottom: 24px !important;
    }

    .a11y-widget-section:last-child {
      margin-bottom: 0 !important;
    }

    .a11y-widget-section-title {
      font-size: 13px !important;
      font-weight: 600 !important;
      color: #374151 !important;
      margin-bottom: 12px !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
    }

    /* Profile Cards */
    .a11y-widget-profiles {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 12px !important;
    }

    .a11y-widget-profile {
      padding: 16px !important;
      border: 2px solid #e5e7eb !important;
      border-radius: 12px !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
      text-align: center !important;
      background: white !important;
    }

    .a11y-widget-profile:hover {
      border-color: ${config.color} !important;
      background: rgba(0,102,204,0.02) !important;
    }

    .a11y-widget-profile.active {
      border-color: ${config.color} !important;
      background: rgba(0,102,204,0.05) !important;
    }

    .a11y-widget-profile-icon {
      width: 32px !important;
      height: 32px !important;
      margin: 0 auto 8px !important;
      color: ${config.color} !important;
    }

    .a11y-widget-profile-title {
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #1f2937 !important;
      margin-bottom: 4px !important;
    }

    .a11y-widget-profile-desc {
      font-size: 11px !important;
      color: #6b7280 !important;
      line-height: 1.3 !important;
    }

    /* Controls */
    .a11y-widget-control {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 12px 0 !important;
      border-bottom: 1px solid #f3f4f6 !important;
    }

    .a11y-widget-control:last-child {
      border-bottom: none !important;
    }

    .a11y-widget-control-label {
      font-size: 14px !important;
      color: #374151 !important;
      font-weight: 500 !important;
    }

    /* Toggle Switch */
    .a11y-widget-switch {
      position: relative !important;
      width: 44px !important;
      height: 24px !important;
      background: #e5e7eb !important;
      border-radius: 12px !important;
      cursor: pointer !important;
      transition: background 0.2s ease !important;
    }

    .a11y-widget-switch.active {
      background: ${config.color} !important;
    }

    .a11y-widget-switch::after {
      content: '' !important;
      position: absolute !important;
      top: 2px !important;
      left: 2px !important;
      width: 20px !important;
      height: 20px !important;
      background: white !important;
      border-radius: 50% !important;
      transition: transform 0.2s ease !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
    }

    .a11y-widget-switch.active::after {
      transform: translateX(20px) !important;
    }

    /* Slider */
    .a11y-widget-slider {
      width: 120px !important;
      height: 6px !important;
      background: #e5e7eb !important;
      border-radius: 3px !important;
      position: relative !important;
      cursor: pointer !important;
    }

    .a11y-widget-slider::after {
      content: '' !important;
      position: absolute !important;
      top: -5px !important;
      left: 0 !important;
      width: 16px !important;
      height: 16px !important;
      background: ${config.color} !important;
      border-radius: 50% !important;
      transition: left 0.2s ease !important;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
    }

    /* Footer */
    .a11y-widget-footer {
      padding: 16px 24px !important;
      border-top: 1px solid #e5e7eb !important;
      background: #f9fafb !important;
      text-align: center !important;
      font-size: 11px !important;
      color: #6b7280 !important;
    }

    /* Positioning Classes */
    .a11y-position-bottom-right .a11y-widget-button {
      bottom: 24px !important;
      right: 24px !important;
    }

    .a11y-position-bottom-right .a11y-widget-panel {
      bottom: 24px !important;
      right: 104px !important;
      transform: translateX(30px) scale(0.95) !important;
    }

    .a11y-position-bottom-left .a11y-widget-button {
      bottom: 24px !important;
      left: 24px !important;
    }

    .a11y-position-bottom-left .a11y-widget-panel {
      bottom: 24px !important;
      left: 104px !important;
      transform: translateX(-30px) scale(0.95) !important;
    }

    .a11y-position-top-right .a11y-widget-button {
      top: 24px !important;
      right: 24px !important;
    }

    .a11y-position-top-right .a11y-widget-panel {
      top: 24px !important;
      right: 104px !important;
      transform: translateX(30px) scale(0.95) !important;
    }

    .a11y-position-top-left .a11y-widget-button {
      top: 24px !important;
      left: 24px !important;
    }

    .a11y-position-top-left .a11y-widget-panel {
      top: 24px !important;
      left: 104px !important;
      transform: translateX(-30px) scale(0.95) !important;
    }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .a11y-widget-panel {
        bottom: 100px !important;
        left: 16px !important;
        right: 16px !important;
        top: auto !important;
        width: auto !important;
        transform: translateY(50px) scale(0.95) !important;
      }

      .a11y-widget-panel.visible {
        transform: translateY(0) scale(1) !important;
      }

      .a11y-widget-profiles {
        grid-template-columns: 1fr !important;
      }
    }

    /* High Contrast Mode */
    .a11y-high-contrast {
      filter: contrast(1.5) !important;
    }

    .a11y-high-contrast .a11y-widget-panel {
      background: #000000 !important;
      color: #ffffff !important;
      border: 2px solid #ffffff !important;
    }

    .a11y-high-contrast .a11y-widget-header {
      background: #000000 !important;
      border-bottom-color: #ffffff !important;
    }

    .a11y-high-contrast .a11y-widget-title {
      color: #ffffff !important;
    }

    .a11y-high-contrast .a11y-widget-control-label {
      color: #ffffff !important;
    }
  `;

  // SVG Icons
  const ICONS = {
    logo: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`,
    close: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`,
    profiles: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 8H17c-.8 0-1.54.37-2.01.95l-2.66 3.39a.47.47 0 0 0 .08.65c.17.13.4.16.61.06L15 11.5V20h2zm-7.5-10.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S11 6.17 11 7s.67 1.5 1.5 1.5zM5.5 6c1.11 0 2-.89 2-2s-.89-2-2-2-2 .89-2 2 .89 2 2 2zm2 16v-7H9V9.5c0-.8-.7-1.5-1.5-1.5S6 8.7 6 9.5V15H4v7h3.5z"/></svg>`,
    vision: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
    content: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>`,
    navigation: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`
  };

  // Übersetzungen
  const TRANSLATIONS = {
    de: {
      title: 'Accessible',
      close: 'Schließen',
      tabs: {
        profiles: 'Profile',
        vision: 'Sehen',
        content: 'Inhalt',
        navigation: 'Navigation'
      },
      profiles: {
        title: 'BARRIEREFREIHEITSPROFILE',
        vision: { title: 'Sehbehinderung', desc: 'Größerer Text, höherer Kontrast' },
        cognitive: { title: 'Kognitive Beeinträchtigung', desc: 'Vereinfachtes Layout' },
        motor: { title: 'Motorisch Beeinträchtigt', desc: 'Bessere Bedienbarkeit' },
        senior: { title: 'Senioren', desc: 'Größere Schrift, bessere Lesbarkeit' },
        adhd: { title: 'ADHS-freundlich', desc: 'Reduzierte Ablenkungen' },
        dyslexia: { title: 'Lese-freundlich', desc: 'Optimierte Schriftart' }
      },
      vision: {
        title: 'SEHEN-EINSTELLUNGEN',
        contrast: 'Kontrast erhöhen',
        textSize: 'Textgröße',
        darkMode: 'Dunkler Modus'
      },
      footer: 'Barrierefreiheit von BrandingBrothers.de'
    },
    en: {
      title: 'Accessible',
      close: 'Close',
      tabs: {
        profiles: 'Profiles',
        vision: 'Vision',
        content: 'Content',
        navigation: 'Navigation'
      },
      profiles: {
        title: 'ACCESSIBILITY PROFILES',
        vision: { title: 'Visual Impairment', desc: 'Larger text, higher contrast' },
        cognitive: { title: 'Cognitive Disability', desc: 'Simplified layout' },
        motor: { title: 'Motor Impaired', desc: 'Better usability' },
        senior: { title: 'Senior Friendly', desc: 'Larger font, better readability' },
        adhd: { title: 'ADHD Friendly', desc: 'Reduced distractions' },
        dyslexia: { title: 'Dyslexia Friendly', desc: 'Optimized font' }
      },
      vision: {
        title: 'VISION SETTINGS',
        contrast: 'Increase contrast',
        textSize: 'Text size',
        darkMode: 'Dark mode'
      },
      footer: 'Accessibility by BrandingBrothers.de'
    }
  };

  let isOpen = false;
  let activeProfile = null;
  let settings = {
    contrast: false,
    textSize: 0,
    darkMode: false,
    highlightLinks: false,
    highlightHeadings: false,
    keyboardNav: false,
    focusHighlight: false
  };

  function getTranslation(path) {
    const t = TRANSLATIONS[config.language] || TRANSLATIONS.de;
    return path.split('.').reduce((obj, key) => obj?.[key], t) || path;
  }

  function injectStyles() {
    if (document.getElementById('a11y-widget-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'a11y-widget-styles';
    style.textContent = COMPLETE_CSS;
    document.head.appendChild(style);
  }

  function createWidget() {
    const container = document.createElement('div');
    container.className = `a11y-widget-container a11y-position-${config.position}`;
    
    // Button
    const button = document.createElement('button');
    button.className = 'a11y-widget-button';
    button.innerHTML = ICONS.logo;
    button.setAttribute('aria-label', getTranslation('title'));
    button.onclick = togglePanel;
    
    // Panel
    const panel = createPanel();
    
    container.appendChild(button);
    container.appendChild(panel);
    document.body.appendChild(container);
  }

  function createPanel() {
    const panel = document.createElement('div');
    panel.className = 'a11y-widget-panel';
    
    panel.innerHTML = `
      <div class="a11y-widget-header">
        <div class="a11y-widget-title">
          ${ICONS.logo}
          ${getTranslation('title')}
        </div>
        <button class="a11y-widget-close" onclick="toggleA11yPanel()">
          ${ICONS.close}
        </button>
      </div>
      
      <div class="a11y-widget-tabs">
        <button class="a11y-widget-tab active" data-tab="profiles">
          <div class="a11y-widget-tab-icon">${ICONS.profiles}</div>
          ${getTranslation('tabs.profiles')}
        </button>
        <button class="a11y-widget-tab" data-tab="vision">
          <div class="a11y-widget-tab-icon">${ICONS.vision}</div>
          ${getTranslation('tabs.vision')}
        </button>
        <button class="a11y-widget-tab" data-tab="content">
          <div class="a11y-widget-tab-icon">${ICONS.content}</div>
          ${getTranslation('tabs.content')}
        </button>
        <button class="a11y-widget-tab" data-tab="navigation">
          <div class="a11y-widget-tab-icon">${ICONS.navigation}</div>
          ${getTranslation('tabs.navigation')}
        </button>
      </div>
      
      <div class="a11y-widget-content">
        <div class="a11y-widget-tab-content" data-tab="profiles">
          <div class="a11y-widget-section">
            <div class="a11y-widget-section-title">${getTranslation('profiles.title')}</div>
            <div class="a11y-widget-profiles">
              <div class="a11y-widget-profile" data-profile="vision">
                <div class="a11y-widget-profile-icon">${ICONS.vision}</div>
                <div class="a11y-widget-profile-title">${getTranslation('profiles.vision.title')}</div>
                <div class="a11y-widget-profile-desc">${getTranslation('profiles.vision.desc')}</div>
              </div>
              <div class="a11y-widget-profile" data-profile="cognitive">
                <div class="a11y-widget-profile-icon">${ICONS.content}</div>
                <div class="a11y-widget-profile-title">${getTranslation('profiles.cognitive.title')}</div>
                <div class="a11y-widget-profile-desc">${getTranslation('profiles.cognitive.desc')}</div>
              </div>
              <div class="a11y-widget-profile" data-profile="motor">
                <div class="a11y-widget-profile-icon">${ICONS.navigation}</div>
                <div class="a11y-widget-profile-title">${getTranslation('profiles.motor.title')}</div>
                <div class="a11y-widget-profile-desc">${getTranslation('profiles.motor.desc')}</div>
              </div>
              <div class="a11y-widget-profile" data-profile="senior">
                <div class="a11y-widget-profile-icon">${ICONS.profiles}</div>
                <div class="a11y-widget-profile-title">${getTranslation('profiles.senior.title')}</div>
                <div class="a11y-widget-profile-desc">${getTranslation('profiles.senior.desc')}</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="a11y-widget-tab-content" data-tab="vision" style="display: none;">
          <div class="a11y-widget-section">
            <div class="a11y-widget-section-title">${getTranslation('vision.title')}</div>
            <div class="a11y-widget-control">
              <div class="a11y-widget-control-label">${getTranslation('vision.contrast')}</div>
              <div class="a11y-widget-switch" data-setting="contrast"></div>
            </div>
            <div class="a11y-widget-control">
              <div class="a11y-widget-control-label">${getTranslation('vision.textSize')}</div>
              <div class="a11y-widget-slider" data-setting="textSize"></div>
            </div>
            <div class="a11y-widget-control">
              <div class="a11y-widget-control-label">${getTranslation('vision.darkMode')}</div>
              <div class="a11y-widget-switch" data-setting="darkMode"></div>
            </div>
          </div>
        </div>
        
        <div class="a11y-widget-tab-content" data-tab="content" style="display: none;">
          <div class="a11y-widget-section">
            <div class="a11y-widget-section-title">INHALT-EINSTELLUNGEN</div>
            <div class="a11y-widget-control">
              <div class="a11y-widget-control-label">Links hervorheben</div>
              <div class="a11y-widget-switch" data-setting="highlightLinks"></div>
            </div>
            <div class="a11y-widget-control">
              <div class="a11y-widget-control-label">Überschriften hervorheben</div>
              <div class="a11y-widget-switch" data-setting="highlightHeadings"></div>
            </div>
          </div>
        </div>
        
        <div class="a11y-widget-tab-content" data-tab="navigation" style="display: none;">
          <div class="a11y-widget-section">
            <div class="a11y-widget-section-title">NAVIGATION-EINSTELLUNGEN</div>
            <div class="a11y-widget-control">
              <div class="a11y-widget-control-label">Tastatur-Navigation</div>
              <div class="a11y-widget-switch" data-setting="keyboardNav"></div>
            </div>
            <div class="a11y-widget-control">
              <div class="a11y-widget-control-label">Fokus hervorheben</div>
              <div class="a11y-widget-switch" data-setting="focusHighlight"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="a11y-widget-footer">
        ${getTranslation('footer')}
      </div>
    `;
    
    setupEventListeners(panel);
    return panel;
  }

  function setupEventListeners(panel) {
    // Tab-Wechsel
    panel.querySelectorAll('.a11y-widget-tab').forEach(tab => {
      tab.onclick = () => switchTab(tab.dataset.tab);
    });

    // Profile
    panel.querySelectorAll('.a11y-widget-profile').forEach(profile => {
      profile.onclick = () => activateProfile(profile.dataset.profile);
    });

    // Switches
    panel.querySelectorAll('.a11y-widget-switch').forEach(toggle => {
      toggle.onclick = () => toggleSetting(toggle.dataset.setting);
    });

    // Sliders
    panel.querySelectorAll('.a11y-widget-slider').forEach(slider => {
      slider.onclick = (e) => handleSlider(e, slider.dataset.setting);
    });
  }

  function switchTab(tabName) {
    const panel = document.querySelector('.a11y-widget-panel');
    
    // Tab-Buttons aktualisieren
    panel.querySelectorAll('.a11y-widget-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.tab === tabName);
    });
    
    // Content aktualisieren
    panel.querySelectorAll('.a11y-widget-tab-content').forEach(content => {
      content.style.display = content.dataset.tab === tabName ? 'block' : 'none';
    });
  }

  function activateProfile(profileName) {
    activeProfile = profileName;
    
    // Visuelles Feedback
    document.querySelectorAll('.a11y-widget-profile').forEach(profile => {
      profile.classList.toggle('active', profile.dataset.profile === profileName);
    });
    
    // Profil-spezifische Einstellungen anwenden
    applyProfileSettings(profileName);
  }

  function applyProfileSettings(profileName) {
    const profiles = {
      vision: { contrast: true, textSize: 2 },
      cognitive: { darkMode: false, highlightHeadings: true },
      motor: { keyboardNav: true, focusHighlight: true },
      senior: { textSize: 1, contrast: true }
    };
    
    const profileSettings = profiles[profileName];
    if (profileSettings) {
      Object.entries(profileSettings).forEach(([key, value]) => {
        settings[key] = value;
        updateSettingUI(key, value);
      });
      applySettings();
      saveSettings();
    }
  }

  function toggleSetting(settingName) {
    settings[settingName] = !settings[settingName];
    updateSettingUI(settingName, settings[settingName]);
    applySettings();
    saveSettings();
  }

  function handleSlider(e, settingName) {
    const slider = e.target;
    const rect = slider.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    
    if (settingName === 'textSize') {
      settings.textSize = Math.round(percentage * 5);
    }
    
    updateSettingUI(settingName, settings[settingName]);
    applySettings();
    saveSettings();
  }

  function updateSettingUI(settingName, value) {
    const toggle = document.querySelector(`[data-setting="${settingName}"]`);
    if (!toggle) return;
    
    if (toggle.classList.contains('a11y-widget-switch')) {
      toggle.classList.toggle('active', value);
    } else if (toggle.classList.contains('a11y-widget-slider')) {
      if (settingName === 'textSize') {
        const percentage = value / 5;
        toggle.style.setProperty('--slider-position', `${percentage * 100}%`);
        toggle.style.setProperty('--slider-left', `${percentage * (120 - 16)}px`);
      }
    }
  }

  function applySettings() {
    const body = document.body;
    
    // Kontrast
    body.classList.toggle('a11y-high-contrast', settings.contrast);
    
    // Textgröße
    if (settings.textSize > 0) {
      body.style.fontSize = `${100 + (settings.textSize * 10)}%`;
    } else {
      body.style.fontSize = '';
    }
    
    // Dark Mode
    if (settings.darkMode) {
      body.style.filter = 'invert(1) hue-rotate(180deg)';
    } else {
      body.style.filter = '';
    }
    
    // Links hervorheben
    removeInjectedStyles('a11y-highlight-links');
    if (settings.highlightLinks) {
      injectCustomStyle('a11y-highlight-links', 'a { background: #ffff00 !important; color: #000000 !important; padding: 2px 4px !important; border-radius: 3px !important; }');
    }
    
    // Überschriften hervorheben
    removeInjectedStyles('a11y-highlight-headings');
    if (settings.highlightHeadings) {
      injectCustomStyle('a11y-highlight-headings', 'h1, h2, h3, h4, h5, h6 { background: #e0f2ff !important; padding: 8px !important; border-left: 4px solid #0066cc !important; margin: 8px 0 !important; }');
    }
    
    // Fokus hervorheben
    removeInjectedStyles('a11y-focus-highlight');
    if (settings.focusHighlight) {
      injectCustomStyle('a11y-focus-highlight', '*:focus { outline: 3px solid #ff6600 !important; outline-offset: 2px !important; }');
    }
  }

  function injectCustomStyle(id, css) {
    if (document.getElementById(id)) return;
    
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  function removeInjectedStyles(id) {
    const existingStyle = document.getElementById(id);
    if (existingStyle) {
      existingStyle.remove();
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem('a11y-widget-settings', JSON.stringify(settings));
      localStorage.setItem('a11y-widget-profile', activeProfile || '');
    } catch (e) {
      console.warn('Could not save accessibility settings to localStorage');
    }
  }

  function loadSettings() {
    try {
      const savedSettings = localStorage.getItem('a11y-widget-settings');
      const savedProfile = localStorage.getItem('a11y-widget-profile');
      
      if (savedSettings) {
        settings = { ...settings, ...JSON.parse(savedSettings) };
      }
      
      if (savedProfile) {
        activeProfile = savedProfile;
        setTimeout(() => {
          const profileElement = document.querySelector(`[data-profile="${activeProfile}"]`);
          if (profileElement) {
            profileElement.classList.add('active');
          }
        }, 100);
      }
    } catch (e) {
      console.warn('Could not load accessibility settings from localStorage');
    }
  }

  function togglePanel() {
    const panel = document.querySelector('.a11y-widget-panel');
    isOpen = !isOpen;
    panel.classList.toggle('visible', isOpen);
    
    if (isOpen) {
      // Update UI when panel opens
      Object.entries(settings).forEach(([key, value]) => {
        updateSettingUI(key, value);
      });
    }
  }

  // Globale Funktionen für Event-Handler
  window.toggleA11yPanel = togglePanel;

  function init() {
    loadSettings();
    injectStyles();
    createWidget();
    applySettings();
    
    // Update slider styles
    const sliderStyle = document.createElement('style');
    sliderStyle.textContent = `
      .a11y-widget-slider::after {
        left: var(--slider-left, 0) !important;
      }
    `;
    document.head.appendChild(sliderStyle);
  }

  // Auto-Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
