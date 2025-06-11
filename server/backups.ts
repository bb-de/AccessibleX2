import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import archiver from 'archiver';

export function setupBackupRoutes(app: express.Express) {
  // Route to download backups
  app.get('/api/backups/download', async (req: Request, res: Response) => {
    try {
      const backupsDir = path.join(process.cwd(), 'backups');
      
      // Check if backups directory exists
      if (!fs.existsSync(backupsDir)) {
        return res.status(404).json({ error: 'No backups found' });
      }
      
      // Create a file to stream archive data to
      const zipFileName = `accessibility-widget-backups-${Date.now()}.zip`;
      const zipFilePath = path.join(process.cwd(), zipFileName);
      const output = fs.createWriteStream(zipFilePath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Maximum compression
      });
      
      // Handle archive warnings and errors
      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn('Archive warning:', err);
        } else {
          throw err;
        }
      });
      
      archive.on('error', (err) => {
        throw err;
      });
      
      // Set up archive completion event
      output.on('close', () => {
        // Set headers for file download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);
        
        // Stream the file to the client
        const fileStream = fs.createReadStream(zipFilePath);
        fileStream.pipe(res);
        
        // Delete the temporary zip file after sending
        fileStream.on('close', () => {
          fs.unlinkSync(zipFilePath);
        });
      });
      
      // Pipe archive data to the file
      archive.pipe(output);
      
      // Add the entire backups directory to the archive
      archive.directory(backupsDir, 'backups');
      
      // Finalize the archive
      await archive.finalize();
    } catch (error) {
      console.error('Error creating backup archive:', error);
      res.status(500).json({ error: 'Failed to create backup archive' });
    }
  });
}