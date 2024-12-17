import HistorialAjustes from "../models/historialAjustes.js";
import { Ventas } from "../models/Ventas.js";
import Compras from "../models/Compras.js";
import Producto from "../models/Productos.js"; 

export async function generarReporteSaldos(req, res) {
    const { fechaCorte } = req.params;

    try {
        const corte = new Date(fechaCorte);
        corte.setHours(23, 59, 59, 999);

        const cantidades = await inicializarCantidades();
        const movimientos = await obtenerMovimientos(corte, cantidades);

        res.json(movimientos);
    } catch (error) {
        console.error('Error al generar el reporte:', error);
        res.status(500).json({ error: 'No se pudo generar el reporte' });
    }
}

const inicializarCantidades = async () => {
    const productos = await Producto.find(); 
    const cantidades = {};

    productos.forEach(producto => {
        cantidades[producto.Referencia] = 0; 
    });

    return cantidades;
};

const obtenerMovimientos = async (fechaCorte, cantidades) => {
    const inicio = new Date(0);
    const fin = new Date(fechaCorte);

    console.log('Fecha de corte:', fin);

    const productos = await Producto.find();
    
    console.log('Productos encontrados:', productos.length);

    const cantidadesPorProducto = {};
    productos.forEach(producto => {
        cantidadesPorProducto[producto.Referencia] = {
            descripcion: producto.Descripcion,
            cantidad: 0
        };
    });

    console.log('Productos inicializados:', Object.keys(cantidadesPorProducto).length);

    const ajustes = await HistorialAjustes.find({
        fecha: { $lte: fin }
    }).sort({ fecha: 1 });

    console.log('Ajustes encontrados:', ajustes.length);

    const comprasPipeline = [
        { $match: { fecha: { $lte: fin } } },
        { $unwind: "$productos" }
    ];
    const compras = await Compras.aggregate(comprasPipeline);
    
    console.log('Compras encontradas:', compras.length);

    const ventasPipeline = [
        { $match: { VFecha: { $lte: fin } } },
        { $unwind: "$productos" }
    ];
    const ventas = await Ventas.aggregate(ventasPipeline);
    
    console.log('Ventas encontradas:', ventas.length);

    // Procesar movimientos
    ajustes.forEach(ajuste => {
        const referencia = ajuste.producto;
        if (cantidadesPorProducto[referencia]) {
            cantidadesPorProducto[referencia].cantidad += ajuste.cantidadAjustada;
        }
    });

    compras.forEach(compra => {
        const referencia = compra.productos.referencia;
        if (cantidadesPorProducto[referencia]) {
            cantidadesPorProducto[referencia].cantidad += compra.productos.cantidad;
        }
    });

    ventas.forEach(venta => {
        const referencia = venta.productos.referencia;
        if (cantidadesPorProducto[referencia]) {
            cantidadesPorProducto[referencia].cantidad -= venta.productos.cantidad;
        }
    });

    const saldosPorProducto = Object.entries(cantidadesPorProducto)
        .filter(([_, data]) => data.cantidad !== 0)
        .map(([referencia, data]) => ({
            referencia,
            descripcion: data.descripcion,
            cantidad: data.cantidad
        }));

    console.log('Saldos finales:', saldosPorProducto.length);

    return {
        saldosPorProducto
    };
};