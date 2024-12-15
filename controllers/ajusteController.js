import Producto from '../models/Productos.js';
import HistorialAjustes from '../models/historialAjustes.js'; 

export async function ajusteProducto(req, res) {
    const { referencia, cantidad, tipoAjuste } = req.body;

    try {
        const producto = await Producto.findOne({ Referencia: referencia });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        if (isNaN(cantidad)) {
            return res.status(400).json({ error: 'Cantidad no válida' });
        }

        const cantidadInicial = producto.Cantidad;
        producto.Cantidad += cantidad;

        if (producto.Cantidad < 0) {
            return res.status(400).json({ error: 'La cantidad no puede ser negativa' });
        }

        await producto.save();

        const nuevoHistorial = new HistorialAjustes({
            producto: referencia,
            cantidadAjustada: cantidad,
            cantidadFinal: producto.Cantidad,
            tipoAjuste: tipoAjuste // Add this field to the schema
        });

        await nuevoHistorial.save();

        return res.json({ nuevaCantidad: producto.Cantidad });
    } catch (error) {
        console.error('Error al realizar el ajuste:', error);
        return res.status(500).json({ error: 'Hubo un error al realizar el ajuste' });
    }
}