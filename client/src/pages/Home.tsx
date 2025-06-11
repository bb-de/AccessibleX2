import React from 'react';
import { Link } from 'wouter';
// Importiere die vollständige Widget-Komponente
import { AccessibilityWidget } from '@/components/accessibility/AccessibilityWidget';
import { LogoImage } from '@/components/accessibility/LogoImage';
import { Helmet } from 'react-helmet';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Barrierefreiheits-Widget - Brandingbrothers.de</title>
        <meta name="description" content="Verbessertes Barrierefreiheits-Widget für eine zugänglichere Web-Erfahrung. Verbessern Sie die Zugänglichkeit Ihrer Website mit unserem anpassbaren Widget." />
      </Helmet>

      <header className="text-center mb-12">
        <div className="mb-6 flex justify-center">
          <LogoImage width={250} height={65} />
        </div>
        <h1 className="text-4xl font-bold mb-4">Barrierefreies Web für alle</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unser fortschrittliches Barrierefreiheits-Widget verbessert die Zugänglichkeit Ihrer Website für alle Benutzer.
        </p>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-blue-50 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Verbessern Sie jetzt die Barrierefreiheit Ihrer Website</h2>
              <p className="mb-6 text-gray-700">
                Unser Widget bietet ein intuitives Interface für verschiedene Barrierefreiheitsprofile und Anpassungsoptionen:
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Sehbehindertenunterstützung</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Kognitive Behinderungen</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Motorische Einschränkungen</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Effizienzmodus und Screenreader-Unterstützung</span>
                </li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link href="/widget-integration" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Widget für Ihre Website
                </Link>
                <Link href="/widget-docs" className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  Technische Dokumentation
                </Link>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/screenshot-widget.png" 
                  alt="Barrierefreiheits-Widget Demo" 
                  className="object-contain max-h-full"
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    (e.target as HTMLElement).style.display = 'none';
                    const fallback = document.getElementById('widget-fallback');
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                <div 
                  id="widget-fallback"
                  className="absolute inset-0 flex-col items-center justify-center bg-gray-50 text-center p-4"
                  style={{display: 'none'}}
                >
                  <p className="text-lg font-medium mb-2">Widget-Vorschau</p>
                  <p className="text-sm text-gray-500">Klicken Sie unten rechts auf das Barrierefreiheits-Symbol, um das Widget zu öffnen und zu testen.</p>
                </div>
              </div>
              <div className="mt-4 text-center text-sm text-gray-500">
                Testen Sie das Widget direkt auf dieser Seite!<br />
                <span className="font-medium">Klicken Sie auf das Barrierefreiheits-Symbol in der unteren rechten Ecke.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Umfassende Barrierefreiheits-Funktionen</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sehbehinderungen-Support</h3>
              <p className="text-gray-600">
                Kontrastanpassungen, Text- und Kursorgröße, Farbfilter und mehr für eine verbesserte visuelle Erfahrung.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Kognitive Unterstützung</h3>
              <p className="text-gray-600">
                Lesehilfen, spezielle Schriftarten und angepasstes Layout für bessere Lesbarkeit und Verständlichkeit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Mehrsprachige Unterstützung</h3>
              <p className="text-gray-600">
                Vollständige Übersetzungen in Deutsch, Englisch, Französisch und Spanisch für internationale Nutzer.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Bereit für ein barrierefreies Weberlebnis?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Integrieren Sie unser Widget in Ihre Website und verbessern Sie die Zugänglichkeit für alle Ihre Besucher.
          </p>
          <Link href="/widget-integration" className="px-8 py-4 bg-blue-600 text-white rounded-lg font-medium text-lg hover:bg-blue-700 transition-colors inline-block">
            Jetzt kostenlos testen
          </Link>
        </section>
      </main>

      <footer className="text-center text-gray-500 text-sm mt-8 pb-4">
        <p>© 2025 brandingbrothers.de · Alle Rechte vorbehalten</p>
      </footer>

      {/* Das AccessibilityWidget einbinden */}
      <AccessibilityWidget />
    </div>
  );
}