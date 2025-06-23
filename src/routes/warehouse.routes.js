"use strict";
import { Router } from "express";
import {
    getWarehouse,
    getWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse
} from "../controllers/warehouse.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.get("/one", authenticateJwt, getWarehouse);
// router.get("/", authenticateJwt, getWarehouses);

router.post("/", authenticateJwt, createWarehouse);
router.put("/", authenticateJwt, updateWarehouse);
router.delete("/", authenticateJwt, deleteWarehouse);

export default router;