import dotenv from "dotenv";
dotenv.config(); // Load env vars FIRST, before any other imports use process.env

import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// connect DB
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Bookings API: http://localhost:${PORT}${process.env.API_URI}bookings`);
});