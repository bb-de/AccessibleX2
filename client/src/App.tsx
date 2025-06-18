import React from 'react';
import { Router as WouterRouter, Route, Switch } from 'wouter';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { WidgetDemo } from '@/pages/WidgetDemo';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { useAccessibility } from "@/hooks/useAccessibility";
import { SpeechControls } from "@/components/accessibility/SpeechControls";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={WidgetDemo} />
      <Route component={WidgetDemo} />
    </Switch>
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
          <SpeechControlsWrapper />
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function SpeechControlsWrapper() {
  const { settings } = useAccessibility();
  return settings.textToSpeech ? (
    <div className="fixed bottom-5 right-[120px] z-[10000]">
      <SpeechControls />
    </div>
  ) : null;
}

export default App;