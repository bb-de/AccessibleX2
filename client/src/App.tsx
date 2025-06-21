import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AccessibilityProvider, useAccessibility } from './contexts/AccessibilityContext';
import { queryClient } from './lib/queryClient';
import Home from './pages/Home';
import { WidgetDemo } from './pages/WidgetDemo';
import NotFound from './pages/not-found';
import { WidgetIntegrationPage } from './pages/WidgetIntegrationPage';
import { WidgetDocsPage } from './pages/WidgetDocsPage';
import { SpeechControls } from './components/accessibility/SpeechControls';
import './styles/global-accessibility.css';
import { useDeviceDetection } from './lib/device-detection';

function SpeechControlsPortal({ isMobile }: { isMobile: boolean }) {
  const { settings } = useAccessibility();

  if (!settings.textToSpeech) {
    return null;
  }

  return createPortal(<SpeechControls isMobile={isMobile} />, document.body);
}

function App() {
  const { isMobile } = useDeviceDetection();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AccessibilityProvider shadowRoot={null}>
          <Router>
            <div className="min-h-screen">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/widget-demo" element={<WidgetDemo />} />
                <Route path="/integration" element={<WidgetIntegrationPage />} />
                <Route path="/docs" element={<WidgetDocsPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
          <SpeechControlsPortal isMobile={isMobile} />
        </AccessibilityProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;