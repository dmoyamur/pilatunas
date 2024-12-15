import { Schema, model } from 'mongoose';

const historialAjustesSchema = new Schema(
    {
        producto: {
            type: String,
            required: true,
        },
        cantidadAjustada: {
            type: Number,
            required: true,
        },
        cantidadFinal: {
            type: Number,
            required: true,
        },
        tipoAjuste: {
            type: String,
            enum: ['positivo', 'negativo'],
            required: true
        },
        fecha: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default model('HistorialAjustes', historialAjustesSchema);
