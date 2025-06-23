"use strict";
import Product from "../entity/product.entity.js";
import Warehouse from "../entity/warehouse.entity.js";
import { AppDataSource } from "../config/configDb.js";

export async function getProductService(query) {
    try {
        const { id, nombre, warehouseId } = query;

        const productRepository = AppDataSource.getRepository(Product);

        const where = [];
        if (id) where.push({ id: id });
        if (nombre) where.push({ nombre: nombre });
        if (warehouseId) where.push({ bodega: { id: warehouseId } });

        const productFound = await productRepository.findOne({
            where: where,
            relations: ["bodega"]
        });

        if (!productFound) return [null, "Producto no encontrado"];

        return [productFound, null];
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function getProductsService(query = {}) {
    try {
        const { warehouseId } = query;
        const productRepository = AppDataSource.getRepository(Product);

        let queryOptions = {
            relations: ["bodega"]
        };

        if (warehouseId) {
            queryOptions.where = {
                bodega: { id: warehouseId }
            };
        }

        const products = await productRepository.find(queryOptions);

        if (!products || products.length === 0) return [null, "No hay productos registrados"];

        return [products, null];
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function createProductService(data) {
    try {
        const { nombre, descripcion, precio, cantidad, warehouseId } = data;

        const warehouseRepository = AppDataSource.getRepository(Warehouse);
        const warehouseFound = await warehouseRepository.findOne({
            where: { id: warehouseId },
            relations: ["productos"]
        });

        if (!warehouseFound) return [null, "La bodega especificada no existe"];

        const currentProducts = warehouseFound.productos || [];
        const currentQuantity = currentProducts.reduce((sum, product) => sum + product.cantidad, 0);

        if (currentQuantity + cantidad > warehouseFound.capacidad) {
            return [null, "La bodega no tiene suficiente capacidad para esta cantidad de productos"];
        }

        const productRepository = AppDataSource.getRepository(Product);

        const uniqueId = `PROD-${Math.random().toString(36).substring(2, 10)}`;

        const newProduct = productRepository.create({
            id: uniqueId,
            nombre,
            descripcion,
            precio,
            cantidad,
            bodega: warehouseFound
        });

        await productRepository.save(newProduct);

        const savedProduct = await productRepository.findOne({
            where: { id: newProduct.id },
            relations: ["bodega"]
        });

        return [savedProduct, null];
    } catch (error) {
        console.error("Error al crear el producto:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function updateProductService(query, data) {
    try {
        const { id, nombre: queryNombre } = query;
        const { nombre, descripcion, precio, cantidad, warehouseId } = data;

        const productRepository = AppDataSource.getRepository(Product);

        const productFound = await productRepository.findOne({
            where: [{ id: id }, { nombre: queryNombre }],
            relations: ["bodega"]
        });

        if (!productFound) return [null, "Producto no encontrado"];

        if (warehouseId && warehouseId !== productFound.bodega.id) {
            const warehouseRepository = AppDataSource.getRepository(Warehouse);
            const newWarehouse = await warehouseRepository.findOne({
                where: { id: warehouseId },
                relations: ["productos"]
            });

            if (!newWarehouse) return [null, "La bodega especificada no existe"];

            const currentProducts = newWarehouse.productos || [];
            const currentQuantity = currentProducts.reduce((sum, product) => sum + product.cantidad, 0);
            const newQuantity = cantidad !== undefined ? cantidad : productFound.cantidad;

            if (currentQuantity + newQuantity > newWarehouse.capacidad) {
                return [null, "La bodega no tiene suficiente capacidad para esta cantidad de productos"];
            }

            productFound.bodega = newWarehouse;
        }

        if (nombre) productFound.nombre = nombre;
        if (descripcion !== undefined) productFound.descripcion = descripcion;
        if (precio !== undefined) productFound.precio = precio;
        if (cantidad !== undefined) productFound.cantidad = cantidad;

        productFound.updatedAt = new Date();

        await productRepository.save(productFound);

        const updatedProduct = await productRepository.findOne({
            where: { id: productFound.id },
            relations: ["bodega"]
        });

        return [updatedProduct, null];
    } catch (error) {
        console.error("Error al actualizar el producto:", error);
        return [null, "Error interno del servidor"];
    }
}

export async function deleteProductService(query) {
    try {
        const { id, nombre } = query;

        const productRepository = AppDataSource.getRepository(Product);

        const productFound = await productRepository.findOne({
            where: [{ id: id }, { nombre: nombre }],
            relations: ["bodega"]
        });

        if (!productFound) return [null, "Producto no encontrado"];

        const productDeleted = await productRepository.remove(productFound);

        return [productDeleted, null];
    } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return [null, "Error interno del servidor"];
    }
}