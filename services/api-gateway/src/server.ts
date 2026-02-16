import app from './app.js';
import configs from './configs/index.js';

const server = app.listen(configs.PORT, () => {
  console.log(`Worker ${process.pid} running on port ${configs.PORT} \n`);
});

process.on('SIGTERM', () => {
  console.log(`Worker ${process.pid} SIGTERM`);

  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log(`Worker ${process.pid} SIGINT`);

  server.close(() => process.exit(0));
});

