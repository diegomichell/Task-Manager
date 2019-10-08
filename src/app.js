import express from 'express';
import { TaskRouter, UserRouter } from './routes';

const app = express();

app.use(express.json());

app.use(UserRouter);
app.use(TaskRouter);

export default app;