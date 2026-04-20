import bookingModel from "./bookings.model.js";
import serviceModel from "../services/services.model.js";
import userModel from "../auth/user.model.js";

//Create booking
const createBooking = async (req, res) => {
    console.log("@req.body", req.body);

    try {
        const { userId, serviceId, vehicle, date, timeSlot, message } = req.body;

        if (!serviceId || !date || !timeSlot) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        //check if user exists
        const user = await userModel.findById(userId);
        console.log(user, "@user");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        //check if service exists
        const service = await serviceModel.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        const formattedVehicle = {
            name: vehicle.name,
            brand: vehicle.brand,
            vehicleNumber: vehicle.regNo,
        };


        const existingBooking = await bookingModel.findOne({
            date,
            timeSlot,
            status: { $in: ["pending", "confirmed"] },
        });

        if (existingBooking) {
            return res.status(400).json({
                success: false,
                message: "Booking already exists",
            });
        }

        const booking = await bookingModel.create({
            userId,
            serviceId,
            vehicle: formattedVehicle,
            date,
            timeSlot,
            message,
        });

        res.status(201).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Get All Bookings
const getAllBookings = async (req, res) => {
    try {
        //Return books with pagination
        const { page = 1, limit = 10 } = req.query;

        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const total = await bookingModel.countDocuments();
        const bookings = await bookingModel.find().skip(skip).limit(limitNum);

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Get All Bookings by User
const getBookingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        //check if user exists
        // const user = await userModel.findById(userId);
        // if (!user) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "User not found",
        //     });
        // }

        const bookings = await bookingModel.find({ userId });
        res.status(200).json({
            success: true,
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Get Booking by Id
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;

        const booking = await bookingModel.findById(id);

        //check if booking exists
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//update booking as per booking id
const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, vehicle, date, timeSlot, message } = req.body;

        const booking = await bookingModel.findById(id);

        // check exists
        if (!booking || booking.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // USER trying to update
        if (req.user.role === "user") {
            // only allow own booking
            if (booking.userId.toString() !== req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            // user cannot change status
            if (status) {
                return res.status(400).json({
                    success: false,
                    message: "Users cannot update status",
                });
            }

            // allow editable fields
            if (vehicle) {
                booking.vehicle = {
                    name: vehicle.name,
                    brand: vehicle.brand,
                    vehicleNumber: vehicle.vehicleNumber || vehicle.regNo,
                };
            }

            if (date) booking.date = date;
            if (timeSlot) booking.timeSlot = timeSlot;
            if (message) booking.message = message;
        }

        // ADMIN updating status
        if (req.user.role === "admin") {
            if (status) {
                const allowedTransitions = {
                    pending: ["confirmed", "rejected"],
                    confirmed: ["completed"],
                };

                const currentStatus = booking.status;

                if (
                    !allowedTransitions[currentStatus] ||
                    !allowedTransitions[currentStatus].includes(status)
                ) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid status transition from ${currentStatus} to ${status}`,
                    });
                }

                booking.status = status;
            }

            // optionally allow admin to edit other fields too
            //   if (vehicle) booking.vehicle = vehicle;
            //   if (date) booking.date = date;
            //   if (timeSlot) booking.timeSlot = timeSlot;
            //   if (message) booking.message = message;
        }

        await booking.save();

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//delete booking
const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await bookingModel.findByIdAndDelete(id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Booking deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


export {
    createBooking,
    getAllBookings,
    getBookingsByUser,
    getBookingById,
    updateBooking,
    deleteBooking,
};

