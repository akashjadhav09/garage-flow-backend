import serviceModel from "../services/services.model.js";

//create service
const createService = async (req, res) => {
    try {
        const { name, price, duration, createdBy } = req.body;

        //check if name, price, duration are provided
        if (!name || !price || !duration) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //check if service already exists
        const existingService = await serviceModel.findOne({ name });
        if (existingService) {
            return res.status(400).json({
                success: false,
                message: "Service already exists",
            });
        }

        const service = await serviceModel.create({
            name,
            price,
            duration,
            createdBy
        });

        res.status(201).json({
            success: true,
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get services with pagination
const getServices = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        //convert page and limit to number
        const pageNum = Number(page);
        const limitNum = Number(limit);

        //search query
        const query = { isDeleted: false };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const services = await serviceModel.find(query)
            .limit(limitNum)
            .skip((pageNum - 1) * limitNum)
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: services,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Get service by id
const getServiceById = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await serviceModel.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }
        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Update service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, duration } = req.body;

        //check if service exists
        const service = await serviceModel.findById(id);
        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        //check if service name already exists
        const existingService = await serviceModel.findOne({ name });
        if (existingService) {
            return res.status(400).json({
                success: false,
                message: "Service already exists",
            });
        }

        // update allowed fields only
        if (name !== undefined) service.name = name;
        if (price !== undefined) service.price = price;
        if (duration !== undefined) service.duration = duration;

        await service.save();

        res.status(200).json({
            success: true,
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Hard delete
const hardDeleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await serviceModel.findById(id);

        if (!service || service.isDeleted) {
            return res.status(404).json({ message: 'Service not found' });
        }

        await serviceModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Service deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//soft delete service
// const deleteService = async (req, res) => {
//     try{
//         const { id } = req.params;
//         const service = await serviceModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
//         if(!service){
//             return res.status(404).json({
//                 success: false,
//                 message: "Service not found",
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: service,
//         });
//     }catch(error){
//         res.status(500).json({
//             success: false,
//             message: error.message,
//         });
//     }
// };

export {
    createService,
    getServices,
    getServiceById,
    updateService,
    hardDeleteService,
    // deleteService,
};

