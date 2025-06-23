"use strict";
import Warehouse from "../entity/warehouse.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getWarehouseService(query) {
    try {
        const { id, nombre } = query;

        const warehouseRepository = AppDataSource.getRepository(Warehouse);

        const warehouseFound = await warehouseRepository.findOne({
            where: [{ id: id }, { nombre: nombre }],
            relations: ["productos"]
        });

        if (!warehouseFound) return [null, "Bodega no encontrada"];

        return [warehouseFound, null];
    } catch (error) {
        console.error("Error al obtener la bodega:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getWarehousesService() {
    try {
        const warehouseRepository = AppDataSource.getRepository(Warehouse);

        const warehouses = await warehouseRepository.find({
            relations: ["productos"]
        });

        if (!warehouses || warehouses.length === 0) return [null, "No hay bodegas registradas"];

        return [warehouses, null];
    } catch (error) {
        console.error("Error al obtener las bodegas:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function createWarehouseService(data) {
    try {
        const { nombre, ubicacion, capacidad } = data;

        const warehouseRepository = AppDataSource.getRepository(Warehouse);

        const existingWarehouse = await warehouseRepository.findOne({
            where: { nombre }
        });

        if (existingWarehouse)
            return [null, "Ya existe una bodega con ese nombre"];

        const uniqueId = `BODEGA-${Math.random().toString(36).substring(2, 10)}`;

        const newWarehouse = warehouseRepository.create({
            id: uniqueId,
            nombre,
            ubicacion,
            capacidad
        });

        await warehouseRepository.save(newWarehouse);

        return [newWarehouse, null];
    } catch (error) {
        console.error("Error al crear la bodega:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateWarehouseService(query, data) {
    try {
        const { id, nombre: queryNombre } = query;
        const { nombre, ubicacion, capacidad } = data;

        const warehouseRepository = AppDataSource.getRepository(Warehouse);

        const warehouseFound = await warehouseRepository.findOne({
            where: [{ id: id }, { nombre: queryNombre }],
        });

        if (!warehouseFound) return [null, "Bodega no encontrada"];

        if (nombre && nombre !== warehouseFound.nombre) {
            const existingWarehouse = await warehouseRepository.findOne({
                where: { nombre }
            });

            if (existingWarehouse) return [null, "Ya existe una bodega con ese nombre"];
        }

        if (nombre) warehouseFound.nombre = nombre;
        if (ubicacion) warehouseFound.ubicacion = ubicacion;
        if (capacidad !== undefined) warehouseFound.capacidad = capacidad;

        warehouseFound.updatedAt = new Date();

        await warehouseRepository.save(warehouseFound);

        return [warehouseFound, null];
    } catch (error) {
        console.error("Error al actualizar la bodega:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteWarehouseService(query) {
    try {
        const { id, nombre } = query;

        const warehouseRepository = AppDataSource.getRepository(Warehouse);

        const warehouseFound = await warehouseRepository.findOne({
            where: [{ id: id }, { nombre: nombre }],
            relations: ["productos"]
        });

        if (!warehouseFound) return [null, "Bodega no encontrada"];

        if (warehouseFound.productos && warehouseFound.productos.length > 0) {
            return [null, "No se puede eliminar la bodega porque tiene productos asociados"];
        }

        const warehouseDeleted = await warehouseRepository.remove(warehouseFound);

        return [warehouseDeleted, null];
    } catch (error) {
        console.error("Error al eliminar la bodega:", error);
        return [null, "Error interno del servidor"];
    }
}