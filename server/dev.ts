import './index';
import { setupVite } from './vite';
import { createServer } from 'http';
import express from 'express';

const app = express();
const httpServer = createServer(app);

(async () => {
  await setupVite(app, httpServer);
  // ... resto del código para levantar el server en desarrollo
})(); 