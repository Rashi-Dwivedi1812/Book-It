import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import connectDB from './db';
import experienceRoutes from './routes/experienceRoutes';
import bookingRoutes from './routes/bookingRoutes';

const app = express();

// Connect DB
connectDB();

const port = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: 'https://book-it-neon.vercel.app' }));
app.use(express.json());

// Routes
app.use('/api/experiences', experienceRoutes);
app.use('/api', bookingRoutes);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
