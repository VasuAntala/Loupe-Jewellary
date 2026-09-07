const app = require('.');
const { connectDB } = require('./config/db');
const { ensureAdminUserExists } = require('./seed/ensureAdmin');
const PORT = Number(process.env.PORT) || 5455;

const startServer = (port) => {
  const server = app.listen(port, async () => {
    await connectDB();
    try {
      await ensureAdminUserExists();
    } catch (err) {
      console.error("Failed to ensure admin user:", err?.message || err);
    }
    console.log('server started on PORT: ', port);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      const fallbackPort = (Number(process.env.PORT) || 5454) + 1;
      console.warn(`Port ${port} in use. Trying ${fallbackPort}...`);
      startServer(fallbackPort);
    } else {
      console.error('Server failed to start:', err);
      process.exit(1);
    }
  });
};

startServer(PORT);