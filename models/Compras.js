// models/Compras.js
import { Schema, model } from "mongoose";

const ProductoCompraSchema = new Schema({
    referencia: {
        type: String,
        required: true,
        trim: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    }
});

// Esquema para la compra
const CompraSchema = new Schema({
    CFecha: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    CFormaPago: { 
        type: String,
        required: true 
    },
    productos: [ProductoCompraSchema],
    totalCompra: { 
        type: Number, 
        required: true, 
        min: 0 
    }
});

export const Compras = model('Compras', CompraSchema);