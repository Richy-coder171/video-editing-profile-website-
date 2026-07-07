import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import app from './app.js';
import { validateServerEnv } from './config/env.js';

const serverRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
dotenv.config({ path: resolve(serverRoot, '.env') });

const PORT = process.env.PORT || 5000;

const startServer = () => {
  try {
    validateServerEnv();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`API listening on port ${PORT}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Stop the existing server or set PORT to another value.`);
      process.exit(1);
    }

    throw error;
  });
};

startServer();
