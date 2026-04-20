
import express from 'express';
import cors from 'cors';

import servicesRoute from "./modules/services/services.route.js";
import bookingsRoute from "./modules/bookings/bookings.route.js";
import authRoute from "./modules/auth/user.route.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

const API_URI = process.env.API_URI || "/api/v1/";

app.use(API_URI + "services", servicesRoute);
app.use(API_URI + "bookings", bookingsRoute);
app.use(API_URI + "auth", authRoute);
export default app;