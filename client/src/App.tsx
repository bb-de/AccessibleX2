import React, { useEffect, useState } from 'react';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { WidgetDemo } from '@/pages/WidgetDemo';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAccessibility } from "@/hooks/useAccessibility";
import { SpeechControls } from "@/components/accessibility/SpeechControls";
import { createPortal } from "react-dom";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={WidgetDemo} />
      <Route component={WidgetDemo} />
    </Switch>
  );
}

function SpeechControlsPortal() {
  const { settings } = useAccessibility();
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (settings.textToSpeech) {
      const el = document.createElement("div");
      el.id = "speech-controls-portal";
      document.body.appendChild(el);
      setContainer(el);
      return () => {
        document.body.removeChild(el);
        setContainer(null);
      };
    }
  }, [settings.textToSpeech]);

  if (!settings.textToSpeech || !container) return null;
  return createPortal(
    <div style={{ position: "fixed", bottom: 20, right: 140, zIndex: 1000001 }}>
      <SpeechControls />
    </div>,
    container
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityProvider shadowRoot={null}>
          <WouterRouter>
            <div className="min-h-screen">
              <AppRouter />
            </div>
          </WouterRouter>
          <Toaster />
          <SpeechControlsPortal />
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;