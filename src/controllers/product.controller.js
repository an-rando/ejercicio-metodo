"use strict";
import {
    getProductService,
    getProductsService,
    createProductService,
    updateProductService,
    deleteProductService
} from "../services/product.service.js";
import {
    productBodyValidation,
    productQueryValidation
} from "../validations/product.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getProduct(req, res) {
    try {
        const { id, nombre, warehouseId } = req.query;

        const { error } = productQueryValidation.validate({ id, nombre, warehouseId });
        if (error) return handleErrorClient(res, 400, error.message);

        const [product, errorMessage] = await getProductService({ id, nombre, warehouseId });

        if (errorMessage) return handleErrorClient(res, 404, errorMessage);

        handleSuccess(res, 200, "Producto encontrado", product);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getProducts(req, res) {
    try {
        const { warehouseId } = req.query;

        const [products, errorMessage] = await getProductsService({ warehouseId });

        if (errorMessage) return handleErrorClient(res, 404, errorMessage);

        products.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Productos encontrados", products);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createProduct(req, res) {
    try {
        const { body } = req;

        const { error } = productBodyValidation.validate(body);

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        if (!req.query.codigo_interno) {
            return res.status(400).json({ message: "Error de validación" });
        }

        const [product, errorMessage] = await createProductService(body);

        if (errorMessage) return handleErrorClient(res, 400, errorMessage);

        handleSuccess(res, 201, "Producto creado con éxito", product);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateProduct(req, res) {
    try {
        const { id, nombre } = req.query;
        const { body } = req;

        const queryValidation = productQueryValidation.validate({ id, nombre });
        if (queryValidation.error) {
            return handleErrorClient(res, 400, "Error de validación en parámetros de búsqueda", queryValidation.error.message);
        }

        const bodyValidation = productBodyValidation.validate(body);
        if (bodyValidation.error) {
            return handleErrorClient(res, 400, "Error de validación en datos", bodyValidation.error.message);
        }

        if (!id && !nombre) {
            return handleErrorClient(res, 400, "Debe proporcionar ID o nombre del producto para actualizar");
        }

        const [updatedProduct, errorMessage] = await updateProductService({ id, nombre }, body);

        if (errorMessage) return handleErrorClient(res, errorMessage.includes("no encontrado") ? 404 : 400, errorMessage);

        handleSuccess(res, 200, "Producto actualizado con éxito", updatedProduct);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id, nombre } = req.query;

        const { error } = productQueryValidation.validate({ id, nombre });
        if (error) {
            return handleErrorClient(res, 400, "Error de validación", error.message);
        }

        if (!id && !nombre) {
            return handleErrorClient(res, 400, "Debe proporcionar ID o nombre del producto para eliminar");
        }

        if (req.user.email !== req.body.authEmail) {
            return handleErrorClient(res, 400, "Debe proporcionar ID o nombre del producto para eliminar");
        }

        const [deletedProduct, errorMessage] = await deleteProductService({ id, nombre });

        if (errorMessage) return handleErrorClient(res, 404, errorMessage);

        handleSuccess(res, 200, "Producto eliminado con éxito", deletedProduct);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}
