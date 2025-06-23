"use strict";
import { AppDataSource } from "../config/configDb.js";

const productoRepository = AppDataSource.getRepository("Producto");
const bodegaRepository = AppDataSource.getRepository("Bodega");

export const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, sku, bodegaId } = req.body;

    if (!nombre || !bodegaId) {
      return res.status(400).json({
        message: "El nombre del producto y la bodega son obligatorios",
      });
    }

    const bodega = await bodegaRepository.findOneBy({ id: bodegaId });
    if (!bodega) {
      return res.status(404).json({
        message: "La bodega especificada no existe",
      });
    }

    if (sku) {
      const existingProduct = await productoRepository.findOneBy({ sku });
      if (existingProduct) {
        return res.status(400).json({
          message: "Ya existe un producto con ese SKU",
        });
      }
    }

    const newProducto = productoRepository.create({
      nombre,
      descripcion,
      precio: precio || 0,
      stock: stock || 0,
      sku,
      bodega,
    });

    await productoRepository.save(newProducto);

    return res.status(201).json({
      message: "Producto creado con éxito",
      data: newProducto,
    });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({
      message: "Error al crear el producto",
      error: error.message,
    });
  }
};

export const getProductos = async (req, res) => {
  try {
    const productos = await productoRepository.find({
      relations: ["bodega"],
    });

    return res.status(200).json({
      message: "Productos obtenidos con éxito",
      data: productos,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await productoRepository.findOne({
      where: { id },
      relations: ["bodega"],
    });

    if (!producto) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    return res.status(200).json({
      message: "Producto obtenido con éxito",
      data: producto,
    });
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({
      message: "Error al obtener el producto",
      error: error.message,
    });
  }
};

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, sku, bodegaId } = req.body;

    const producto = await productoRepository.findOneBy({ id });

    if (!producto) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    let bodega = null;
    if (bodegaId) {
      bodega = await bodegaRepository.findOneBy({ id: bodegaId });
      if (!bodega) {
        return res.status(404).json({
          message: "La bodega especificada no existe",
        });
      }
    }

    if (sku && sku !== producto.sku) {
      const existingProduct = await productoRepository.findOneBy({ sku });
      if (existingProduct) {
        return res.status(400).json({
          message: "Ya existe un producto con ese SKU",
        });
      }
    }

    productoRepository.merge(producto, {
      nombre: nombre || producto.nombre,
      descripcion: descripcion !== undefined ? descripcion : producto.descripcion,
      precio: precio !== undefined ? precio : producto.precio,
      stock: stock !== undefined ? stock : producto.stock,
      sku: sku !== undefined ? sku : producto.sku,
      bodega: bodega || producto.bodega,
    });

    await productoRepository.save(producto);

    return res.status(200).json({
      message: "Producto actualizado con éxito",
      data: producto,
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;

    const producto = await productoRepository.findOneBy({ id });

    if (!producto) {
      return res.status(404).json({
        message: "Producto no encontrado",
      });
    }

    await productoRepository.remove(producto);

    return res.status(200).json({
      message: "Producto eliminado con éxito",
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return res.status(500).json({
      message: "Error al eliminar el producto",
      error: error.message,
    });
  }
};

export const getProductosByBodega = async (req, res) => {
  try {
    const { bodegaId } = req.params;

    const bodega = await bodegaRepository.findOneBy({ id: bodegaId });
    if (!bodega) {
      return res.status(404).json({
        message: "La bodega especificada no existe",
      });
    }

    const productos = await productoRepository.find({
      where: { bodega: { id: bodegaId } },
    });

    return res.status(200).json({
      message: "Productos obtenidos con éxito",
      data: productos,
    });
  } catch (error) {
    console.error("Error al obtener productos por bodega:", error);
    return res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};