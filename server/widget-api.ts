import express, { Request, Response } from 'express';
import crypto from 'crypto';

/**
 * Widget API-Routen für externe Nutzung
 * Diese Routen werden für das Widget verwendet, wenn es auf einer externen Website eingebunden wird
 */
export function setupWidgetApiRoutes(app: express.Express) {
  // Öffentliche API-Routen für das Widget

  // Widget-Token validieren
  app.post('/api/widget/validate-token', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({ 
          success: false, 
          message: 'Token is required' 
        });
      }

      // Hier würde in der Produktionsumgebung eine Validierung gegen die Datenbank erfolgen
      // Da dies eine Demo-Version ist, akzeptieren wir jeden Token
      res.json({ 
        success: true, 
        status: 'active',
        config: {
          theme: 'default',
          features: ['all']
        }
      });
    } catch (error) {
      console.error('Error validating token:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });

  // Widget-Registrierung für neue Websites
  app.post('/api/widget/register', async (req: Request, res: Response) => {
    try {
      const { domain, email, companyName } = req.body;

      if (!domain || !email) {
        return res.status(400).json({ 
          success: false, 
          message: 'Domain and email are required' 
        });
      }

      // In einer Produktivumgebung würden wir hier einen neuen Token generieren
      // und in der Datenbank speichern
      const tokenId = generateToken();

      // Demo-Antwort
      res.json({ 
        success: true, 
        tokenId,
        message: 'Widget successfully registered',
        scriptTag: `<script src="https://accessible-widget-vv-2-dobro-de.replit.app/widget/accessibility.js" data-token-id="${tokenId}" data-language="de"></script>`
      });
    } catch (error) {
      console.error('Error registering widget:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  });
}

// Token für neue Widget-Registrierung generieren
function generateToken(): string {
  return 'a' + crypto.randomBytes(16).toString('hex');
}