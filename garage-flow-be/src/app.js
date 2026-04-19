
import express from 'express';
import cors from 'cors';

import servicesRoute from "./modules/services/services.route.js";
import bookingsRoute from "./modules/bookings/bookings.route.js";

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(process.env.API_URI + "services", servicesRoute);
app.use(process.env.API_URI + "bookings", bookingsRoute);

export default app;