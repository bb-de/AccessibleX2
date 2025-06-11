import React from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Code, Server, Zap, Monitor, BarChart, BookOpen } from 'lucide-react';
import { Link } from 'wouter';

export function WidgetDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Widget Dokumentation - Accessibility Widget</title>
        <meta name="description" content="Technische Dokumentation für die Integration und Anpassung des Barrierefreiheits-Widgets auf Ihrer Website." />
      </Helmet>
      
      <div className="mb-6">
        <Link to="/widget-integration" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Zurück zur Integration
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Technische Dokumentation</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Code className="mr-2 h-6 w-6 text-blue-600" />
          Script-Einbindung
        </h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Basis-Implementierung</h3>
          <p className="mb-4">Um unser Barrierefreiheits-Widget einzubinden, fügen Sie folgenden Code vor dem schließenden &lt;/body&gt;-Tag ein:</p>
          
          <pre className="bg-gray-100 p-4 rounded-md font-mono text-sm mb-4 overflow-x-auto">
{`<script 
  src="https://IHRE-DOMAIN.replit.app/widget/accessibility.js" 
  data-token-id="IHRE_TOKEN_ID" 
  data-language="de"
></script>`}
          </pre>
          
          <p>Ersetzen Sie <code className="bg-gray-100 px-1">IHRE_TOKEN_ID</code> mit dem Token, den Sie bei der Registrierung erhalten haben.</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Anpassungsoptionen</h3>
          <p className="mb-4">Sie können verschiedene <code className="bg-gray-100 px-1">data-*</code> Attribute verwenden, um das Widget anzupassen:</p>
          
          <table className="min-w-full border border-gray-300 mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Attribut</th>
                <th className="py-2 px-4 border-b text-left">Beschreibung</th>
                <th className="py-2 px-4 border-b text-left">Mögliche Werte</th>
                <th className="py-2 px-4 border-b text-left">Standard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b"><code>data-position</code></td>
                <td className="py-2 px-4 border-b">Position des Widget-Buttons</td>
                <td className="py-2 px-4 border-b">bottom-right, bottom-left, top-right, top-left</td>
                <td className="py-2 px-4 border-b">bottom-right</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b"><code>data-language</code></td>
                <td className="py-2 px-4 border-b">Standardsprache des Widgets</td>
                <td className="py-2 px-4 border-b">de, en, fr, es</td>
                <td className="py-2 px-4 border-b">de</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b"><code>data-color</code></td>
                <td className="py-2 px-4 border-b">Primärfarbe des Widget-Buttons</td>
                <td className="py-2 px-4 border-b">Beliebiger HEX-Farbcode</td>
                <td className="py-2 px-4 border-b">#0055A4</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b"><code>data-widget-logo</code></td>
                <td className="py-2 px-4 border-b">URL zu einem benutzerdefinierten Logo</td>
                <td className="py-2 px-4 border-b">URL zu einem Bild</td>
                <td className="py-2 px-4 border-b">Standard-Logo</td>
              </tr>
            </tbody>
          </table>
          
          <h4 className="font-medium mb-2">Beispiel mit allen Optionen:</h4>
          <pre className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
{`<script 
  src="https://IHRE-DOMAIN.replit.app/widget/accessibility.js" 
  data-token-id="IHRE_TOKEN_ID" 
  data-position="bottom-left" 
  data-language="en" 
  data-color="#FF5722" 
  data-widget-logo="https://ihre-domain.de/logo.png"
></script>`}
          </pre>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <Server className="mr-2 h-6 w-6 text-blue-600" />
          API Integration
        </h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">API-Endpunkte</h3>
          <p className="mb-4">Unser Widget bietet verschiedene API-Endpunkte für erweiterte Funktionen:</p>
          
          <div className="border border-gray-300 rounded-md mb-4">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-medium">
              API-Endpunkt: /api/widget/analytics
            </div>
            <div className="p-4">
              <p className="mb-2"><strong>Beschreibung:</strong> Ruft Analysedaten zur Widget-Nutzung ab.</p>
              <p className="mb-2"><strong>Methode:</strong> GET</p>
              <p className="mb-2"><strong>Erforderliche Parameter:</strong></p>
              <ul className="list-disc pl-6 mb-2">
                <li><code>tokenId</code> - Ihr Widget-Token</li>
                <li><code>startDate</code> - Startdatum im Format YYYY-MM-DD</li>
                <li><code>endDate</code> - Enddatum im Format YYYY-MM-DD</li>
              </ul>
              <p><strong>Antwort:</strong> JSON-Array mit Nutzungsdaten</p>
            </div>
          </div>
          
          <div className="border border-gray-300 rounded-md">
            <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 font-medium">
              API-Endpunkt: /api/widget/configure
            </div>
            <div className="p-4">
              <p className="mb-2"><strong>Beschreibung:</strong> Aktualisiert die Widget-Konfiguration remotely.</p>
              <p className="mb-2"><strong>Methode:</strong> POST</p>
              <p className="mb-2"><strong>Erforderliche Parameter:</strong></p>
              <ul className="list-disc pl-6 mb-2">
                <li><code>tokenId</code> - Ihr Widget-Token</li>
                <li><code>config</code> - Konfigurationsobjekt mit den zu aktualisierenden Parametern</li>
              </ul>
              <p><strong>Antwort:</strong> Bestätigung der aktualisierten Konfiguration</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Zap className="mr-2 h-5 w-5 text-blue-600" />
            Ereignisse
          </h2>
          
          <p className="mb-4">Sie können eigene JavaScript-Handler für Widget-Ereignisse hinzufügen:</p>
          
          <pre className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4 overflow-x-auto">
{`window.addEventListener('accessibility-widget-event', (event) => {
  const { type, data } = event.detail;
  
  switch (type) {
    case 'profile-applied':
      console.log('Profil angewendet:', data.profileId);
      break;
    case 'widget-opened':
      console.log('Widget geöffnet');
      break;
    case 'widget-closed':
      console.log('Widget geschlossen');
      break;
  }
});`}
          </pre>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Monitor className="mr-2 h-5 w-5 text-blue-600" />
            Spezielle Szenarien
          </h2>
          
          <div className="mb-4">
            <h3 className="font-medium mb-1">Single-Page-Anwendungen (SPA)</h3>
            <p>Für SPAs wie React, Vue oder Angular empfehlen wir, das Widget-Script im Hauptlayout oder im Wurzelelement zu platzieren.</p>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-1">Content Management Systeme (CMS)</h3>
            <p>Bei CMS wie WordPress fügen Sie den Code zur footer.php oder über ein Header/Footer-Plugin hinzu.</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Konfliktlösung</h3>
            <p>Bei Konflikten mit anderen Scripts setzen Sie das <code>async</code>-Attribut, um verzögerte Ladezeit zu verhindern.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BarChart className="mr-2 h-6 w-6 text-blue-600" />
          Analytics und Berichterstattung
        </h2>
        
        <p className="mb-4">Das Widget sammelt anonymisierte Nutzungsdaten, um Ihnen Einblicke in die Barrierefreiheitsbedürfnisse Ihrer Besucher zu geben.</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Verfügbare Berichte</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Anwendung der Barrierefreiheitsprofile</li>
              <li>Am häufigsten genutzte Funktionen</li>
              <li>Verteilung nach Benutzergruppen</li>
              <li>Nutzungstrends im Zeitverlauf</li>
              <li>Regionale Nutzungsmuster</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Datenschutz</h3>
            <p>Alle gesammelten Daten sind anonym und enthalten keine personenbezogenen Informationen. Die Datenerfassung entspricht der DSGVO.</p>
            <p className="mt-2">Ein vollständiger Analysebericht ist im Admin-Dashboard verfügbar, das Sie per E-Mail anfordern können.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
          Support und Ressourcen
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Kontakt und Support</h3>
            <p className="mb-4">Bei Fragen oder Problemen stehen wir Ihnen zur Verfügung:</p>
            <ul className="space-y-2">
              <li><strong>E-Mail:</strong> <a href="mailto:support@brandingbrothers.de" className="text-blue-600 hover:underline">support@brandingbrothers.de</a></li>
              <li><strong>Telefon:</strong> +49 (0) 123 456789</li>
              <li><strong>Support-Zeiten:</strong> Mo-Fr, 9:00 - 17:00 Uhr</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Weitere Ressourcen</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-blue-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  Vollständige Dokumentation (PDF)
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Video-Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-600 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Changelog und Updates
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}