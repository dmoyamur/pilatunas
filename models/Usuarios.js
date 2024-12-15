import { Schema, model } from "mongoose";

const UsuariosSchema = new Schema(
    {
        Usuario: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        Clave: {
            type: String,
            required: true,  
            trim: true
        },
        Activo: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true  
    }
);


// Exportar el modelo
export const Usuario = model('Usuario', UsuariosSchema);