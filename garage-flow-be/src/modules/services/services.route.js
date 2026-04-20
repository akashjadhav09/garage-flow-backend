//route the API
import express from "express";
import { Router } from "express";

// import roleMiddleware from "../shared/middleware/role.middleware.js";
// import authMiddleware from "../shared/middleware/auth.middleware.js";
import { createService, getServices, getServiceById, updateService, hardDeleteService } from "./services.controller.js";

const router = Router();

// router.post("/", roleMiddleware(["admin"]), createService);
// router.get("/", roleMiddleware(["admin", "user"]), getServices);
// router.get("/:id", roleMiddleware(["admin"]), getServiceById);
// router.put("/:id", roleMiddleware(["admin"]), updateService);
// router.delete("/:id", roleMiddleware(["admin"]), hardDeleteService);

router.post("/", createService);
router.get("/", getServices);
router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", hardDeleteService);

export default router;



//Test apis
//http://localhost:5000/api/v1/services - POST/GET
//http://localhost:5000/api/v1/services/:id - GET
//http://localhost:5000/api/v1/services/:id - PUT
//http://localhost:5000/api/v1/services/:id - DELETE

//payload for POST
// {
//     "name": "Service",
//     "price": 100,
//     "duration": "1 hour",
//     "createdBy": "6919524a3f46544597569488"
// }

//payload for PUT
// {
//     "name": "Service",
//     "price": 100,
//     "duration": "1 hour"
// }

//payload for DELETE
// {
//     "id": "6919524a3f46544597569488"
// }
