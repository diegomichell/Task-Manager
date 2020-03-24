import express from 'express';
import * as cors from 'cors';
import { TaskRouter, UserRouter } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use(UserRouter);
app.use(TaskRouter);

export default app;