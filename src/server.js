import http from 'http';
import config from './config.js';

import app from './app.js';

import { init } from './socket.js';
import 'dotenv/config';

// await init();

// const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "http://localhost"

const httpServer = app.listen(PORT, () => {
  // req.logger.info(`Server running on http://localhost:${PORT} 🚀`)
  console.log(`Server running on ${HOST}/${PORT} 🚀`);
});

await init(httpServer);
// server.listen(PORT, () => {
//   console.log(`Server running in http://localhost:${PORT} 🚀`);
// });
