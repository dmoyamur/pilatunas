import HistorialAjustes from "../models/historialAjustes.js";
import { Ventas } from "../models/Ventas.js";
import {Compras} from "../models/Compras.js";

export async function generarReporte(req, res) {
    const { fechaInicio, fechaFin, productoRef } = req.params;

    console.log("Fecha Inicio:", fechaInicio);
    console.log("Fecha Fin:", fechaFin);
    console.log("Referencia Producto:", productoRef);

    try {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        fin.setHours(23, 59, 59, 999);  

        const movimientos = await obtenerMovimientos(inicio, fin, productoRef);

        console.log('Movimientos encontrados:', JSON.stringify(movimientos, null, 2));
        res.json(movimientos);
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ error: 'No se pudo generar el reporte' });
    }
}

const obtenerMovimientos = async (fechaInicio, fechaFin, productoRef) => {
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    fin.setHours(23, 59, 59, 999);

    const filtroProductos = productoRef ? { 'producto': productoRef } : {};

    const comprasPipeline = [
        { $match: { fecha: { $gte: inicio, $lte: fin } } },
        productoRef ? { $unwind: "$productos" } : {},
        productoRef ? { $match: { "productos.referencia": productoRef } } : {}
    ];

    console.log("Consulta Compras:", JSON.stringify(comprasPipeline, null, 2));
    const compras = await Compras.aggregate(comprasPipeline);
    console.log("Resultados de Compras:", JSON.stringify(compras, null, 2));

    const ventasPipeline = [
        { $match: { VFecha: { $gte: inicio, $lte: fin } } },
        productoRef ? { $unwind: "$productos" } : {},
        productoRef ? { $match: { "productos.referencia": productoRef } } : {}
    ];

    console.log("Consulta Ventas:", JSON.stringify(ventasPipeline, null, 2));
    const ventas = await Ventas.aggregate(ventasPipeline);
    console.log("Resultados de Ventas:", JSON.stringify(ventas, null, 2));

    const ajustesPipeline = [
        { $match: { fecha: { $gte: inicio, $lte: fin }, ...filtroProductos } }  
    ];
    
    console.log("Consulta Ajustes:", JSON.stringify(ajustesPipeline, null, 2));
    const ajustes = await HistorialAjustes.aggregate(ajustesPipeline);
    console.log("Resultados de Ajustes:", JSON.stringify(ajustes, null, 2));
    
    return { compras, ventas, ajustes };
    
};
