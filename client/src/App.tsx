import React from 'react';
import { Router, Route, Switch } from 'wouter';
import { AccessibilityProvider } from '@/contexts/AccessibilityContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { WidgetDemo } from '@/pages/WidgetDemo';

function App() {
  return (
    <TooltipProvider>
      <AccessibilityProvider>
        <Router>
          <div className="min-h-screen">
            <Switch>
              <Route path="/" component={WidgetDemo} />
              <Route component={WidgetDemo} />
            </Switch>
          </div>
        </Router>
        <Toaster />
      </AccessibilityProvider>
    </TooltipProvider>
  );
}

export default App;