import React from 'react';
import { Download } from 'lucide-react';

export function BackupDownload() {
  return (
    <div className="text-center my-4">
      <a 
        href="/api/backups/download" 
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Download className="w-4 h-4 mr-2" />
        Backups herunterladen
      </a>
    </div>
  );
}