import http from 'http';
import config from './config.js';

import app from './app.js';

import { init } from './socket.js';
import 'dotenv/config';
import { loggerDev, loggerProd } from './config/logger.js';
// await init();

export const ENVIROMENT = 'LOCAL' // 'INTERNET'
// export const ENVIROMENT = 'INTERNET' // 'LOCAL'

// const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
// const HOST = process.env.HOST || "http://localhost"

const httpServer = app.listen(PORT, () => {
  // req.logger.info(`Server running on http://localhost:${PORT} 🚀`)
  if (ENVIROMENT === 'LOCAL') {
    loggerDev.info(`Server running on ${config.host.localhost} 🚀`)
  }
  else {
    loggerDev.info(`Server running on ${config.host.host} 🚀`)
  }

});

await init(httpServer);
// server.listen(PORT, () => {
//   console.log(`Server running in http://localhost:${PORT} 🚀`);
// });
