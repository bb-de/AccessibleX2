import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Request, Response, NextFunction } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Production CORS und Security Headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Optimierte Statische Dateien
app.use(express.static(path.join(__dirname, '..'), {
  maxAge: '1h',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=3600, immutable');
    }
  }
}));

// Haupt-Widget-Endpunkte
const widgetEndpoints = [
  '/widget.js',
  '/a11y.js', 
  '/accessibility-widget-complete.js'
];

widgetEndpoints.forEach(endpoint => {
  app.get(endpoint, async (req, res) => {
    try {
      const widgetPath = path.join(__dirname, '..', 'accessibility-widget-complete.js');
      const widgetContent = await readFile(widgetPath, 'utf-8');
      
      res.set({
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, immutable',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
        'ETag': `"${Date.now()}"`
      });
      
      res.send(widgetContent);
    } catch (error) {
      console.error(`Widget loading error for ${endpoint}:`, error);
      res.status(500).send('// Widget loading failed');
    }
  });
});

// API-Endpunkt
app.get('/api/widget-info', (req, res) => {
  res.json({
    name: 'Accessibility Widget Complete',
    version: '2.0.0',
    status: 'production',
    features: {
      profiles: 6,
      functions: '50+',
      languages: ['de', 'en'],
      positions: ['bottom-right', 'bottom-left', 'top-right', 'top-left']
    },
    integration: {
      mainUrl: '/widget.js',
      fullUrl: '/accessibility-widget-complete.js',
      shortUrl: '/a11y.js'
    },
    performance: {
      fileSize: '69 KB',
      loadTime: '< 100ms',
      cache: '1 hour'
    },
    support: 'support@brandingbrothers.de'
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    availableEndpoints: [
      '/widget.js',
      '/api/widget-info',
      '/'
    ]
  });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Widget service temporarily unavailable'
  });
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Accessibility Widget CDN läuft auf Port ${PORT}`);
  console.log(`📱 Widget URL: http://localhost:${PORT}/widget.js`);
  console.log(`🌐 Landing Page: http://localhost:${PORT}/`);
  console.log(`📊 API: http://localhost:${PORT}/api/widget-info`);
  console.log(`✅ Production-ready für Replit Deployment!`);
});

export default app;