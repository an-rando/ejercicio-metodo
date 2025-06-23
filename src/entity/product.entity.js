"use strict";
import { EntitySchema } from "typeorm";

const ProductSchema = new EntitySchema({
    name: "Product",
    tableName: "products",
    columns: {
        id: {
            type: "varchar",
            length: 36,
            primary: true,
        },
        nombre: {
            type: "varchar",
            length: 150,
            nullable: false,
        },
        descripcion: {
            type: "varchar",
            length: 500,
            nullable: true,
        },
        precio: {
            type: "decimal",
            precision: 10,
            scale: 2,
            nullable: false,
        },
        cantidad: {
            type: "int",
            nullable: false,
            default: 0,
        },
        createdAt: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
        updatedAt: {
            type: "datetime",
            default: () => "CURRENT_TIMESTAMP",
            nullable: false,
        },
    },
    relations: {
        bodega: {
            type: "many-to-one",
            target: "Warehouse",
            joinColumn: {
                name: "warehouseId",
            },
            nullable: false,
        },
    },
    indices: [
        {
            name: "IDX_PRODUCT",
            columns: ["id"],
            unique: true,
        },
        {
            name: "IDX_PRODUCT_NAME",
            columns: ["nombre"],
        },
    ],
});

export default ProductSchema;