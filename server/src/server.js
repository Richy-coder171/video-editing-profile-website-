import dotenv from 'dotenv';
import { dirname, resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const serverRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const serverEnvPath = resolve(serverRoot, '.env');
dotenv.config({ path: serverEnvPath });

const isBlank = (value) => !String(value || '').trim();

const unquoteRawEnvValue = (value) => {
  const trimmed = String(value || '').trim();
  const quote = trimmed[0];

  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

const restoreRawEnvValues = (names) => {
  let rawEnv;

  try {
    rawEnv = readFileSync(serverEnvPath, 'utf8');
  } catch {
    return;
  }

  rawEnv.split(/\r?\n/).forEach((line) => {
    const equalsIndex = line.indexOf('=');

    if (equalsIndex <= 0) {
      return;
    }

    const name = line.slice(0, equalsIndex).trim();

    if (!names.includes(name) || !isBlank(process.env[name])) {
      return;
    }

    const rawValue = unquoteRawEnvValue(line.slice(equalsIndex + 1));

    if (!isBlank(rawValue)) {
      process.env[name] = rawValue;
    }
  });
};

restoreRawEnvValues(['ADMIN_PASSWORD', 'ADMIN_PASSWORD_HASH', 'JWT_SECRET', 'CLOUDINARY_API_SECRET', 'SUPABASE_SECRET_KEY']);

const [{ default: app }, { validateServerEnv }] = await Promise.all([
  import('./app.js'),
  import('./config/env.js')
]);

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
