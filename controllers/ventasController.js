import Productos from "../models/Productos.js";
import {Ventas}from "../models/Ventas.js";
import mongoose from 'mongoose'; 

export const crearVenta = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { VFecha, VFormaPago, productos, totalVenta, tercero } = req.body;

        for (const producto of productos) {
            const productoInventario = await Productos.findOne({ Referencia: producto.referencia });
            
            if (!productoInventario) {
                await session.abortTransaction();
                return res.status(404).json({ message: `Producto con referencia ${producto.referencia} no encontrado.` });
            }

            if (productoInventario.Cantidad < producto.cantidad) {
                await session.abortTransaction();
                return res.status(400).json({
                    message: `Stock insuficiente para el producto ${producto.referencia}. Stock actual: ${productoInventario.Cantidad}`
                });
            }

            productoInventario.Cantidad -= producto.cantidad;
            await productoInventario.save({ session });
        }

        const nuevaVenta = new Ventas({
            VFecha,
            VFormaPago,
            productos,
            totalVenta,
            tercero
        });

        const ventaGuardada = await nuevaVenta.save({ session });

        await session.commitTransaction();
        res.status(201).json({ message: "Venta creada con éxito.", venta: ventaGuardada });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error al crear la venta:", error);
        res.status(500).json({ message: "Error al crear la venta.", error: error.message });
    } finally {
        session.endSession();
    }
};


export const reportesFechas = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.body;
        
        const startDate = new Date(fechaInicio);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(fechaFin);
        endDate.setHours(23, 59, 59, 999);
        
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ 
                error: 'Fechas inválidas' 
            });
        }

        const ventas = await Ventas.find({
            VFecha: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ VFecha: 1 });

        res.json(ventas);
    } catch (error) {
        console.error('Error en reportesFechas:', error);
        res.status(500).json({ 
            error: 'Error al generar el reporte de ventas' 
        });
    }
};

export default {crearVenta, reportesFechas};