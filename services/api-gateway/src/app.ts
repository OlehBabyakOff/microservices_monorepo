import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import configs from './configs/index.js';

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: configs.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ strict: false, limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use(cookieParser());

app.use(compression());

app.use('/api', router);

export default app;

