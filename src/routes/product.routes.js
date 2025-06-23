"use strict";
import { Router } from "express";
import {
    getProduct,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";

const router = Router();

router.get("/one", getProduct);
//router.get("/", getProducts);

router.post("/", authenticateJwt, createProduct);
router.put("/", authenticateJwt, updateProduct);
router.delete("/", authenticateJwt, deleteProduct);

export default router;