import { Router } from "express";

import { createBooking, getAllBookings, getBookingsByUser, getBookingById, updateBooking, deleteBooking } from "./bookings.controller.js";

const router = Router();

// GET all bookings (Admin) — must be before parameterized routes
router.get("/", getAllBookings);

// GET bookings by user — use distinct path to avoid conflict with /:id
router.get("/user/:userId", getBookingsByUser);

// GET single booking by id
router.get("/:id", getBookingById);

// POST create booking
console.log("createBooking");
router.post("/", createBooking);

// PUT update booking (Admin and User)
router.put("/:id", updateBooking);

// DELETE booking (Admin)
router.delete("/:id", deleteBooking);

export default router;

//Test apis
//http://localhost:3000/api/v1/bookings - POST/GET
//http://localhost:3000/api/v1/bookings/:userId - GET
//http://localhost:3000/api/v1/bookings/:id - GET
//http://localhost:3000/api/v1/bookings/:id - PUT
//http://localhost:3000/api/v1/bookings/:id - DELETE


//Payload for POST
// {
//     "userId": "6919524a3f46544597569488",
//     "serviceId": "6919524a3f46544597569488",
//     "vehicle": {
//         "name": "Car",
//         "brand": "Toyota",
//         "regNo": "KA01AB1234"
//     },
//     "date": "2022-01-01",
//     "timeSlot": "11:00-12:00",
//     "message": "Service required"
// }

//Payload for PUT
// {
//     "status": "confirmed"
// }

//Payload for DELETE
// {
//     "id": "6919524a3f46544597569488"
// }
