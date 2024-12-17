import Productos from "../models/Productos.js";
import {Compras} from "../models/Compras.js";
import mongoose from 'mongoose'; 

export const crearCompra = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const { CFecha, CFormaPago, productos, totalCompra, tercero } = req.body;

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
            CFecha,
            CFormaPago,
            productos,
            totalVenta,
            tercero
        });

        const CompraGuardada = await nuevaCompra.save({ session });

        await session.commitTransaction();
        res.status(201).json({ message: "Compra creada con éxito.", compra: compraGuardada });

    } catch (error) {
        await session.abortTransaction();
        console.error("Error al crear la venta:", error);
        res.status(500).json({ message: "Error al crear la venta.", error: error.message });
    } finally {
        session.endSession();
    }
};



export const generarReporteCompras = async (req, res) => {
    try {
        const { fechaInicio: startDate, fechaFin: endDate } = req.params;

        console.log('Received dates:', { startDate, endDate }); 
        const parseDate = (dateString) => {
            if (!dateString) {
                console.error('Date string is undefined or empty');
                throw new Error(`Invalid date: ${dateString}`);
            }

            const parsedDate = new Date(dateString);
            
            if (isNaN(parsedDate.getTime())) {
                console.error(`Failed to parse date: ${dateString}`);
                throw new Error(`Invalid date: ${dateString}`);
            }

            return parsedDate;
        };

        const start = parseDate(startDate);
        start.setHours(0, 0, 0, 0);

        const end = parseDate(endDate);
        end.setHours(23, 59, 59, 999);

        console.log('Parsed dates:', { start, end }); 

        const compras = await Compras.find({
            fecha: {
                $gte: start,  
                $lte: end     
            }
        }).sort({ fecha: 1 }); 

        console.log('Found purchases:', compras.length); 

        if (!compras || compras.length === 0) {
            return res.status(404).json({ 
                message: 'No se encontraron compras en el rango de fechas especificado' 
            });
        }

        const reporteCompras = compras.map(compra => ({
            fecha: compra.fecha,
            totalCompra: compra.totalCompra,
            proveedor: compra.proveedor,
            productos: compra.productos
        }));

        res.json(reporteCompras);
    } catch (error) {
        console.error('Error al generar reporte de compras:', error);
        res.status(500).json({ 
            message: 'Error interno del servidor', 
            error: error.message 
        });
    }
};