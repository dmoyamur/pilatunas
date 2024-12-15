import { Schema, model } from "mongoose";

const TercerosSchema = new Schema(
    {
        nit: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        nombre: {
            type: String,
            requiered: true,
            trim: true
        },
        direccion: {
            type: String,
            requiered: true,
            trim: true
        },
        telefono: {
            type: String,
            requiered: true,
            trim: true
        },
        ciudad: {
            type: String,
            requiered: true,
            trim: true
        },
        email: {
            type: String,
            requiered: true,
            trim: true
        },
        activo: {
            type: Boolean,
            default: true
        },
       
        
    }
)

export default model('Terceros', TercerosSchema);