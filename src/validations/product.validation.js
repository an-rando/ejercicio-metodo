"use strict";
import Joi from "joi";

export const productBodyValidation = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(150)
        .required()
        .messages({
            "string.empty": "El nombre no puede estar vacío.",
            "any.required": "El nombre es obligatorio.",
            "string.base": "El nombre debe ser de tipo texto.",
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.max": "El nombre debe tener como máximo 150 caracteres.",
        }),
    descripcion: Joi.string()
        .max(500)
        .allow(null, '')
        .messages({
            "string.base": "La descripción debe ser de tipo texto.",
            "string.max": "La descripción debe tener como máximo 500 caracteres.",
        }),
    precio: Joi.number()
        .precision(2)
        .positive()
        .required()
        .messages({
            "number.base": "El precio debe ser un número.",
            "any.required": "El precio es obligatorio.",
            "number.positive": "El precio debe ser mayor que 0.",
            "number.precision": "El precio debe tener como máximo 2 decimales.",
        }),
    cantidad: Joi.number()
        .integer()
        .min(0)
        .required()
        .messages({
            "number.base": "La cantidad debe ser un número.",
            "any.required": "La cantidad es obligatoria.",
            "number.integer": "La cantidad debe ser un número entero.",
            "number.min": "La cantidad no puede ser negativa.",
        }),
    warehouseId: Joi.string()
        .pattern(/^BODEGA-[a-zA-Z0-9]+$/)
        .required()
        .messages({
            "string.base": "El ID de bodega debe ser una cadena de texto.",
            "any.required": "El ID de bodega es obligatorio.",
            "string.pattern.base": "El ID de bodega debe tener el formato BODEGA-XXXXXXXX.",
        }),
}).unknown(false).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

export const productQueryValidation = Joi.object({
    id: Joi.string()
        .pattern(/^PROD-[a-zA-Z0-9]+$/)
        .messages({
            "string.base": "El id debe ser una cadena de texto.",
            "string.pattern.base": "El id debe tener el formato PROD-XXXXXXXX.",
        }),
    nombre: Joi.string()
        .min(3)
        .max(150)
        .messages({
            "string.base": "El nombre debe ser de tipo texto.",
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.max": "El nombre debe tener como máximo 150 caracteres.",
        }),
    warehouseId: Joi.string()
        .pattern(/^BODEGA-[a-zA-Z0-9]+$/)
        .messages({
            "string.base": "El ID de bodega debe ser una cadena de texto.",
            "string.pattern.base": "El ID de bodega debe tener el formato BODEGA-XXXXXXXX.",
        }),
})
    .or("id", "nombre", "warehouseId")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debes proporcionar al menos un parámetro: id, nombre o warehouseId.",
    });