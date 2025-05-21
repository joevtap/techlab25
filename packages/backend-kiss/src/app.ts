import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: '*' }));
app.use(helmet());
app.use(morgan('tiny'));

app.use(express.json());

app.use(errorHandler);
