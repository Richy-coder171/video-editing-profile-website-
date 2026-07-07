import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 5000;

const startServer = () => {
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
