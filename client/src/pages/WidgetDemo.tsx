
import React from 'react';
import { Helmet } from 'react-helmet';
import { AccessibilityWidget } from '@/components/accessibility/AccessibilityWidget';

export function WidgetDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>React Accessibility Widget Demo</title>
        <meta name="description" content="Demo des React Barrierefreiheits-Widgets" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Barrierefreies Web für alle
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unser fortschrittliches Barrierefreiheits-Widget verbessert die Zugänglichkeit Ihrer 
            Website für alle Benutzer.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Verbessern Sie jetzt die Barrierefreiheit Ihrer Website
              </h2>
              
              <p className="text-gray-600 mb-6">
                Unser Widget bietet ein intuitives Interface für verschiedene Barrierefreiheitsprofile und 
                Anpassungsoptionen:
              </p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Sehbehindertenunterstützung</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Kognitive Behinderungen</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Motorische Einschränkungen</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Effizienz-Modus und Screenreader-Unterstützung</span>
                </li>
              </ul>
              
              <div className="space-y-3">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Widget für Ihre Website
                </button>
                <br />
                <button className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  Technische Dokumentation
                </button>
              </div>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Widget-Vorschau</h3>
              <p className="text-gray-600 mb-4">
                Klicken Sie unten rechts auf das Barrierefreiheits-Symbol, um das Widget zu öffnen und zu testen.
              </p>
              <div className="bg-white p-4 rounded border-2 border-dashed border-gray-300 text-center">
                <p className="text-gray-500 mb-4">Testen Sie das Widget direkt auf dieser Seite!</p>
                <p className="text-sm text-gray-400">
                  Klicken Sie auf das Barrierefreiheits-Symbol in der unteren rechten Ecke.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Umfassende Barrierefreiheits-Funktionen
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Seheinstellungen</h3>
              <p className="text-gray-300">Kontrast, Textgröße, Farben anpassen</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Inhalts-Tools</h3>
              <p className="text-gray-300">Lesehilfen, Schriftarten, Hervorhebungen</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Navigation</h3>
              <p className="text-gray-300">Tastatursteuerung, Cursor-Anpassungen</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Das React Accessibility Widget */}
      <AccessibilityWidget />
    </div>
  );
}
