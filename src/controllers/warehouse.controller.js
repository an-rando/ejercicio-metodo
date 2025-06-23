"use strict";
import {
    getWarehouseService,
    getWarehousesService,
    createWarehouseService,
    updateWarehouseService,
    deleteWarehouseService
} from "../services/warehouse.service.js";
import {
    warehouseBodyValidation,
    warehouseQueryValidation
} from "../validations/warehouse.validation.js";
import {
    handleErrorClient,
    handleErrorServer,
    handleSuccess,
} from "../handlers/responseHandlers.js";

export async function getWarehouse(req, res) {
    try {
        const { id, nombre } = req.query;

        const { error } = warehouseQueryValidation.validate({ id, nombre });
        if (error) return handleErrorClient(res, 400, error.message);

        const [warehouse, errorMessage] = await getWarehouseService({ id, nombre });

        if (errorMessage) return handleErrorClient(res, 404, errorMessage);

        handleSuccess(res, 200, "Bodega encontrada", warehouse);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function getWarehouses(req, res) {
    try {
        const [warehouses, errorMessage] = await getWarehousesService();

        if (errorMessage) return handleErrorClient(res, 404, errorMessage);

        warehouses.length === 0
            ? handleSuccess(res, 204)
            : handleSuccess(res, 200, "Bodegas encontradas", warehouses);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function createWarehouse(req, res) {
    try {

        const nombre = req.body.name;
        const ubicacion = req.body.location;
        const capacidad = req.body.capacity;

        const body = { nombre: nombre, ubicacion: ubicacion, capacidad: capacidad }

        const { error } = warehouseBodyValidation.validate(body);

        if (error) return handleErrorClient(res, 400, "Error de validación", error.message);

        const [warehouse, errorMessage] = await createWarehouseService(body);

        if (errorMessage) return handleErrorClient(res, 400, errorMessage);

        handleSuccess(res, 201, "Bodega creada con éxito", warehouse);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function updateWarehouse(req, res) {
    try {
        const { id, nombre } = req.query;
        const { body } = req;

        const { error: queryError } = warehouseQueryValidation.validate({ id, nombre });
        if (queryError) return handleErrorClient(res, 400, "Error de validación en la consulta", queryError.message);

        const { error: bodyError } = warehouseBodyValidation.validate(body);
        if (bodyError) return handleErrorClient(res, 400, "Error de validación en los datos enviados", bodyError.message);

        const [warehouse, errorMessage] = await updateWarehouseService({ id, nombre }, body);

        if (errorMessage) return handleErrorClient(res, 400, errorMessage);

        handleSuccess(res, 200, "Bodega actualizada con éxito", warehouse);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}

export async function deleteWarehouse(req, res) {
    try {
        const { id, nombre } = req.query;

        const { error } = warehouseQueryValidation.validate({ id, nombre });
        if (error) return handleErrorClient(res, 400, "Error de validación en la consulta", error.message);

        const [warehouse, errorMessage] = await deleteWarehouseService({ id, nombre });

        if (errorMessage) return handleErrorClient(res, 400, errorMessage);

        handleSuccess(res, 200, "Bodega eliminada con éxito", warehouse);
    } catch (error) {
        handleErrorServer(res, 500, error.message);
    }
}