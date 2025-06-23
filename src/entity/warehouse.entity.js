"use strict";
import { EntitySchema } from "typeorm";

const WarehouseSchema = new EntitySchema({
    name: "Warehouse",
    tableName: "warehouses",
    columns: {
        id: {
            type: "varchar",
            length: 36,
            primary: true,
        },
        nombre: {
            type: "varchar",
            length: 100,
            nullable: false,
        },
        ubicacion: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        capacidad: {
            type: "int",
            nullable: false,
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
    indices: [
        {
            name: "IDX_WAREHOUSE",
            columns: ["id"],
            unique: true,
        },
        {
            name: "IDX_WAREHOUSE_NOMBRE",
            columns: ["nombre"],
            unique: true,
        },
    ],
    relations: {
        productos: {
            type: "one-to-many",
            target: "Product",
            inverseSide: "bodega",
        },
    },
});

export default WarehouseSchema;