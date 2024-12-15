import { Schema, model } from "mongoose";

const DetVentasSchema = new Schema(
    {
        VCodigo: {
            type: String,
            required: true,
            unique: true,
        },
        VCant: {
            type: Number,
            requiered: true,
        },
        VValorUnit: {
            type: Number,
            requiered: true
        },
       
        
    }
)