import { Schema, model } from "mongoose";

const productosSchema = new Schema(
    {
        Referencia: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        Descripcion: {
            type: String,
            required: true,
            trim: true
        },
        Precio: {
            type: Number,
            required: true
        },
        Activo: {
            type: Boolean,
            default: true
        },

        Cantidad: {
            type: Number, 
            required: true
        }
             
    }
)

export default model('Productos', productosSchema)