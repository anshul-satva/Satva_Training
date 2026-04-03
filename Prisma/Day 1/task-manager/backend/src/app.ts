import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import taskRoutes from './modules/task/task.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'OK', message: "API is running" });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;