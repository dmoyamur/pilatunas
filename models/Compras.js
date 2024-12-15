// models/Compras.js
import mongoose from "mongoose";

const comprasSchema = new mongoose.Schema({
    productos: [{
        referencia: {
            type: String,
            required: true
        },
        descripcion: {
            type: String,
            required: true
        },
        cantidad: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalCompra: {
        type: Number,
        required: true,
        min: 0
    },
    fecha: {
        type: Date,
        default: Date.now,
        required: true
    }
    ,
        proveedor: {
            type: String,
            required: true,
        }
}, {
    timestamps: true 
});

export default mongoose.model('Compras', comprasSchema);