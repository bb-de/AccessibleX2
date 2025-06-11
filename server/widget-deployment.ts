import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// CORS-Header für Cross-Origin-Requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Statische Dateien servieren (optional, falls du weitere Assets hast)
app.use(express.static(path.join(__dirname, '..'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
      res.set('Cache-Control', 'public, max-age=3600'); // 1 Stunde Cache
    }
  }
}));

// Widget ausliefern (CDN-URL)
app.get('/accessibility-widget-complete.js', async (req, res) => {
  try {
    const widgetPath = path.join(__dirname, '..', 'accessibility-widget-complete.js');
    const widgetContent = await readFile(widgetPath, 'utf-8');
    res.set({
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'X-Content-Type-Options': 'nosniff'
    });
    res.send(widgetContent);
  } catch (error) {
    console.error('Widget loading error:', error);
    res.status(500).send('// Widget loading failed');
  }
});

// Kurze URLs für einfache Integration
app.get('/a11y.js', (req, res) => {
  res.redirect('/accessibility-widget-complete.js');
});
app.get('/widget.js', (req, res) => {
  res.redirect('/accessibility-widget-complete.js');
});

// Widget-Info-API (optional, kann auch entfernt werden)
app.get('/api/widget-info', (req, res) => {
  res.json({
    name: 'Accessibility Widget Complete',
    version: '2.0.0',
    features: [
      'Vision accessibility',
      'Cognitive support', 
      'Motor disabilities',
      'Senior-friendly',
      'ADHD-friendly',
      'Reading assistance'
    ],
    languages: ['de', 'en'],
    positions: ['bottom-right', 'bottom-left', 'top-right', 'top-left'],
    integration: {
      script: '/accessibility-widget-complete.js',
      shortUrl: '/widget.js'
    }
  });
});

// Server starten
app.listen(PORT, () => {
  console.log(`Widget-Server läuft auf http://localhost:${PORT}`);
});

export default app;