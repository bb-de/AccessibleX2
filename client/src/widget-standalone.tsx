import React from "react";
import ReactDOM from "react-dom/client";
import { AccessibilityWidget } from "@/components/accessibility/AccessibilityWidget";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import "@/index.css";

// Container für das Widget erzeugen
const container = document.createElement("div");
container.id = "a11y-widget-root";
const shadow = container.attachShadow({ mode: "open" });
document.body.appendChild(container);

// CSS als <link rel="stylesheet"> ins Shadow DOM einfügen
const linkTag = document.createElement("link");
linkTag.rel = "stylesheet";
linkTag.href = "/dist/widget/style.css";
shadow.appendChild(linkTag);

// Widget im Shadow DOM rendern
const shadowRoot = document.createElement("div");
shadow.appendChild(shadowRoot);

ReactDOM.createRoot(shadowRoot).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <AccessibilityWidget />
    </AccessibilityProvider>
  </React.StrictMode>
); 