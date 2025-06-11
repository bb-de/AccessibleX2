
import React from 'react';
import { Helmet } from 'react-helmet';
import { LogoImage } from '@/components/accessibility/LogoImage';
import { Link } from 'wouter';

export function WidgetIntegrationPage() {
  const [domain, setDomain] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [companyName, setCompanyName] = React.useState('');
  const [tokenId, setTokenId] = React.useState<string | null>(null);
  const [scriptTag, setScriptTag] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!domain || !email) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/widget/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          email,
          companyName,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTokenId(data.tokenId);
        setScriptTag(
          `<script src="https://accessible-widget-vv-2-dobro-de.replit.app/widget/accessibility.js" data-token-id="${data.tokenId}" data-language="de"></script>`
        );
      } else {
        setError(data.message || 'Registrierung fehlgeschlagen');
      }
    } catch (err) {
      setError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('In die Zwischenablage kopiert!');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Helmet>
        <title>Widget Integration - Accessibility Widget</title>
        <meta name="description" content="Integrieren Sie das Barrierefreiheits-Widget einfach in Ihre Website" />
      </Helmet>
      
      <div className="text-center mb-8">
        <LogoImage />
        <h1 className="text-3xl font-bold mt-4 mb-4">Widget für Ihre Website</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Machen Sie Ihre Website mit unserem Barrierefreiheits-Widget zugänglicher für alle Benutzer.
          Die Integration ist einfach und erfolgt in wenigen Schritten.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-xl mb-2">1. Registrieren</div>
          <p>Geben Sie Ihre Domain und Kontaktdaten ein, um Ihren persönlichen Zugangscode zu erhalten.</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-xl mb-2">2. Einbinden</div>
          <p>Fügen Sie den generierten Script-Tag in den HTML-Code Ihrer Website ein.</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-blue-600 font-bold text-xl mb-2">3. Fertig!</div>
          <p>Das Barrierefreiheits-Widget erscheint automatisch auf Ihrer Website.</p>
        </div>
      </div>

      {!tokenId ? (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Widget registrieren</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-1">
                Domain/Website URL *
              </label>
              <input
                type="url"
                id="domain"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="https://ihre-website.de"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-Mail-Adresse *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ihre@email.de"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                Unternehmen (optional)
              </label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Ihr Unternehmen"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Registriere...' : 'Widget registrieren'}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">✓ Registrierung erfolgreich!</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Ihr Widget-Token:</h3>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
              {tokenId}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Script-Tag für Ihre Website:</h3>
            <div className="bg-gray-100 p-3 rounded-md relative">
              <pre className="text-sm font-mono overflow-x-auto">{scriptTag}</pre>
              <button
                onClick={() => copyToClipboard(scriptTag!)}
                className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700"
              >
                Kopieren
              </button>
            </div>
          </div>
          
          <div className="text-gray-600 text-sm">
            <p className="mb-2"><strong>Anleitung:</strong></p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Kopieren Sie den obigen Script-Tag</li>
              <li>Fügen Sie ihn vor dem schließenden &lt;/body&gt;-Tag Ihrer HTML-Seite ein</li>
              <li>Das Widget erscheint automatisch unten rechts auf Ihrer Website</li>
            </ol>
          </div>
          
          <div className="mt-6 flex gap-4">
            <Link to="/widget-docs">
              <a className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                Technische Dokumentation
              </a>
            </Link>
            <button
              onClick={() => {
                setTokenId(null);
                setScriptTag(null);
                setDomain('');
                setEmail('');
                setCompanyName('');
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Weiteres Widget registrieren
            </button>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Vorteile der Integration</h3>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Verbesserte Barrierefreiheit für alle Besucher Ihrer Website</li>
          <li>Unterstützung für Menschen mit verschiedenen Behinderungen</li>
          <li>Einfache Integration ohne technisches Know-how</li>
          <li>Regelmäßige Updates und neue Funktionen</li>
          <li>Erfüllung von Barrierefreiheitsstandards</li>
          <li>Analytics zur Nutzung der Barrierefreiheitsfunktionen</li>
        </ul>
      </div>
    </div>
  );
}
