import { Schema, model } from "mongoose";

const ProductoVentaSchema = new Schema({
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

// Esquema para la venta
const VentaSchema = new Schema({
    VFecha: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    VFormaPago: { 
        type: String,
        required: true 
    },
    productos: [ProductoVentaSchema],
    totalVenta: { 
        type: Number, 
        required: true, 
        min: 0 
    }
});

export const Ventas = model('Ventas', VentaSchema);