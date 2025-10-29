// src/index.ts
require('dotenv').config(); // Use require for dotenv

// --- Use classic require() syntax ---
const express = require('express');
const app = express(); // Initialize app right away
const cors = require('cors');
const connectDB = require('./db').default; // Use .default for your own modules

// Import routes
const experienceRoutes = require('./routes/experienceRoutes').default;
const bookingRoutes = require('./routes/bookingRoutes').default;
// --- End of new imports ---

// Connect to Database
connectDB(); // <-- CALL THIS

const port = process.env.PORT || 3001;

// --- Middleware ---
// --- THIS IS THE UPDATE ---
// Allow requests from your deployed frontend URL
app.use(cors({ origin: 'https://book-it-3yzn.vercel.app' })); 
// --- END OF UPDATE ---
app.use(express.json());

// --- API Routes ---
app.use('/api/experiences', experienceRoutes);
app.use('/api', bookingRoutes);

// --- Server Start ---
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});