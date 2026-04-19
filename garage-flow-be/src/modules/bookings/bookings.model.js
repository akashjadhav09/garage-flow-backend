import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },

        vehicle: {
            name: String,
            brand: String,
            vehicleNumber: String,
        },

        date: {
            type: Date,
            required: true,
        },

        timeSlot: {
            type: String, // e.g. "11:00-12:00"
            required: true,
        },

        message: String,

        status: {
            type: String,
            enum: ["pending", "confirmed", "rejected", "completed", "cancelled"],
            default: "pending",
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
export default mongoose.model('Booking', bookingSchema);