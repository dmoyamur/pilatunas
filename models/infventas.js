import mongoose from 'mongoose';

const TotalventasSchema= new mongoose.Schema(
    {
        cantidad:{type: Number},
        precio:{type: Number}
    }
)

module.exports=mongoose.model("TotalventasVentas",TotalventasSchema)