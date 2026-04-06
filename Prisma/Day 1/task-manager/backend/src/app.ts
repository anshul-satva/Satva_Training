import express from 'express';
import cors from 'cors';
import path from 'path';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/category/category.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import tagRoutes from './modules/tag/tag.routes';
import taskRoutes from './modules/task/task.routes';
import { errorHandler } from './shared/middlewares/errorHandler.middleware';
import { requestLogger } from './shared/middlewares/requestLogger.middleware';

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(requestLogger);

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (_req, res) => {
  res.json({ status: 'OK', message: "API is running" });
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
