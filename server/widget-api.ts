import express, { Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';

// Grundlegende Validierungsschemas
const tokenSchema = z.object({
  token: z.string().min(1, 'Token ist erforderlich')
});

const registrationSchema = z.object({
  domain: z.string().min(1, 'Domain ist erforderlich'),
  email: z.string().email('Ungültige E-Mail-Adresse'),
  companyName: z.string().min(2, 'Firmenname muss mindestens 2 Zeichen lang sein')
});

/**
 * Widget API-Routen für externe Nutzung
 * Diese Routen werden für das Widget verwendet, wenn es auf einer externen Website eingebunden wird
 */
export function setupWidgetApiRoutes(app: express.Express) {
  // Widget-Token validieren
  app.post('/api/widget/validate-token', async (req: Request, res: Response) => {
    try {
      const result = tokenSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          message: 'Validierungsfehler',
          errors: result.error.errors
        });
      }

      const { token } = result.data;

      // Einfache Token-Validierung
      if (!token.startsWith('token_')) {
        return res.status(401).json({
          success: false,
          message: 'Ungültiger Token'
        });
      }

      res.json({ 
        success: true, 
        status: 'active',
        config: {
          theme: 'default',
          features: ['all']
        }
      });
    } catch (error) {
      console.error('Fehler bei der Token-Validierung:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Interner Serverfehler' 
      });
    }
  });

  // Widget-Registrierung
  app.post('/api/widget/register', async (req: Request, res: Response) => {
    try {
      const result = registrationSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          success: false, 
          message: 'Validierungsfehler',
          errors: result.error.errors
        });
      }

      const { domain, email, companyName } = result.data;

      // Einfache Token-Generierung
      const tokenId = `token_${crypto.randomBytes(16).toString('hex')}`;

      res.json({ 
        success: true, 
        tokenId,
        message: 'Widget erfolgreich registriert',
        scriptTag: `<script src="/widget/accessibility.js" data-token-id="${tokenId}" data-language="de"></script>`
      });
    } catch (error) {
      console.error('Fehler bei der Widget-Registrierung:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Interner Serverfehler' 
      });
    }
  });
}

// Helper functions
async function validateToken(token: string): Promise<boolean> {
  // Implementierung der Token-Validierung gegen die Datenbank
  return true; // Placeholder
}

async function generateAndStoreToken(domain: string, email: string, companyName: string): Promise<string> {
  // Implementierung der Token-Generierung und -Speicherung
  return crypto.randomBytes(32).toString('hex');
}