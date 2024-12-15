import { Schema, model } from "mongoose";

const DetComprasSchema = new Schema(
    {
        CCodigo: {
            type: String,
            required: true,
            unique: true,
        },
        CCant: {
            type: Number,
            requiered: true,
        },
        CValorUnit: {
            type: Number,
            requiered: true
        },
        
       
    }
)