import React from "react";
import ReactDOM from "react-dom/client";
import { AccessibilityWidget } from "@/components/accessibility/AccessibilityWidget";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import "@/index.css";

// TypeScript-Definition für window.accessibilityWidgetLoaded
declare global {
  interface Window {
    accessibilityWidgetLoaded?: boolean;
  }
}

// Verhindere mehrfache Initialisierung
if (window.accessibilityWidgetLoaded) {
  console.log('Accessibility widget already loaded');
} else {
  // Container für das Widget erzeugen
  const container = document.createElement("div");
  container.id = "a11y-widget-root";
  const shadow = container.attachShadow({ mode: "open" });
  document.body.appendChild(container);

  // CSS als <link rel="stylesheet"> ins Shadow DOM einfügen
  const linkTag = document.createElement("link");
  linkTag.rel = "stylesheet";
  const currentScript = document.currentScript;
  const config = {
    position: currentScript?.getAttribute('data-position') || 'bottom-right',
    language: currentScript?.getAttribute('data-language') || 'de',
    color: currentScript?.getAttribute('data-color') || '#0066cc',
    size: currentScript?.getAttribute('data-size') || 'medium',
    // GitHub Pages URL-Basis
    baseUrl: currentScript?.getAttribute('data-base-url') || ''
  };
  linkTag.href = `${config.baseUrl}/style.css`;
  shadow.appendChild(linkTag);

  // Widget im Shadow DOM rendern
  const shadowRoot = document.createElement("div");
  shadowRoot.style.display = "contents"; // Sicherstellen, dass das Shadow Root selbst kein Layout beeinflusst
  shadow.appendChild(shadowRoot);

  ReactDOM.createRoot(shadowRoot).render(
    <React.StrictMode>
      <AccessibilityProvider shadowRoot={shadow}>
        <AccessibilityWidget shadowRootElement={shadow} />
      </AccessibilityProvider>
    </React.StrictMode>
  );

  // Markiere als geladen
  window.accessibilityWidgetLoaded = true;
} 