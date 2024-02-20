import express from 'express';
import cors from 'cors';
import { Express } from 'express';
export function setupGlobalMiddleware(app: Express) {
  app.use(cors({
    origin: "*", // Be more specific in a production environment
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
}
