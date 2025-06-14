import React from "react";
import ReactDOM from "react-dom/client";
import { AccessibilityWidget } from "@/components/accessibility/AccessibilityWidget";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext"; // ggf. anpassen
import "@/index.css"; // Tailwind oder globale Styles importieren

// Shadow Root für das Widget erzeugen
const container = document.createElement("div");
container.id = "a11y-widget-root";
const shadow = container.attachShadow({ mode: "open" });
document.body.appendChild(container);

// Style-Tag für Tailwind/Widget-Styles ins Shadow DOM einfügen
const styleTag = document.createElement("style");
styleTag.textContent = `
  @import url('/index.css');
`;
shadow.appendChild(styleTag);

// Widget im Shadow DOM rendern
const shadowRoot = document.createElement("div");
shadowRoot.style.display = "contents"; // Sicherstellen, dass das Shadow Root selbst kein Layout beeinflusst
shadow.appendChild(shadowRoot);

ReactDOM.createRoot(shadowRoot).render(
  <React.StrictMode>
    <AccessibilityProvider>
      <AccessibilityWidget shadowRootElement={shadow} />
    </AccessibilityProvider>
  </React.StrictMode>
);
