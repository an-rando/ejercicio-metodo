"use strict";
import Joi from "joi";

export const warehouseBodyValidation = Joi.object({
    nombre: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "El nombre no puede estar vacío.",
            "any.required": "El nombre es obligatorio.",
            "string.base": "El nombre debe ser de tipo texto.",
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.max": "El nombre debe tener como máximo 100 caracteres.",
        }),
    ubicacion: Joi.string()
        .min(5)
        .max(255)
        .required()
        .messages({
            "string.empty": "La ubicación no puede estar vacía.",
            "any.required": "La ubicación es obligatoria.",
            "string.base": "La ubicación debe ser de tipo texto.",
            "string.min": "La ubicación debe tener al menos 5 caracteres.",
            "string.max": "La ubicación debe tener como máximo 255 caracteres.",
        }),
    capacidad: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            "number.base": "La capacidad debe ser un número.",
            "any.required": "La capacidad es obligatoria.",
            "number.integer": "La capacidad debe ser un número entero.",
            "number.min": "La capacidad debe ser mayor que 0.",
        }),
}).unknown(false).messages({
    "object.unknown": "No se permiten propiedades adicionales.",
});

export const warehouseQueryValidation = Joi.object({
    id: Joi.string()
        .pattern(/^BODEGA-[a-zA-Z0-9]+$/)
        .messages({
            "string.base": "El id debe ser una cadena de texto.",
            "string.pattern.base": "El id debe tener el formato BODEGA-XXXXXXXX.",
        }),
    nombre: Joi.string()
        .min(3)
        .max(100)
        .messages({
            "string.base": "El nombre debe ser de tipo texto.",
            "string.min": "El nombre debe tener al menos 3 caracteres.",
            "string.max": "El nombre debe tener como máximo 100 caracteres.",
        }),
})
    .or("id", "nombre")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debes proporcionar al menos un parámetro: id o nombre.",
    });