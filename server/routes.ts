import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupBackupRoutes } from "./backups";
import { setupWidgetRoutes } from './widget-serve';
import { setupWidgetApiRoutes } from './widget-api';

declare module "express-serve-static-core" {
  interface Request {
    session?: {
      id: string;
      [key: string]: any;
    };
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup backup download routes
  setupBackupRoutes(app);

  // Setup widget serving routes
  setupWidgetRoutes(app);

  // Setup widget API routes
  setupWidgetApiRoutes(app);

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}