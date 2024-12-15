import Productos from "../models/Productos.js";
import Compras from "../models/Compras.js";

export const comprarProductos = async (req, res) => {
    try {
        const { proveedor, productos } = req.body; 

        if (!proveedor) {
            return res.status(400).json({
                mensaje: 'Debe proporcionar un proveedor válido.'
            });
        }

        if (!productos || productos.length === 0) {
            return res.status(400).json({
                mensaje: 'Debe proporcionar al menos un producto para comprar.'
            });
        }

        let totalCompra = 0;
        const productosComprados = [];

        for (const item of productos) {
            if (!item.cantidad || isNaN(item.cantidad) || item.cantidad <= 0) {
                return res.status(400).json({
                    mensaje: `Cantidad inválida para el producto ${item.referencia}`
                });
            }

            const producto = await Productos.findOne({ Referencia: item.referencia });

            if (!producto) {
                return res.status(400).json({
                    mensaje: `Producto con referencia ${item.referencia} no encontrado.`
                });
            }

            if (!producto.Activo) {
                return res.status(400).json({
                    mensaje: `El producto ${producto.Referencia} no está disponible.`
                });y
            }

            const subtotal = producto.Precio * item.cantidad;
            totalCompra += subtotal;

            producto.Cantidad = Number(producto.Cantidad) + Number(item.cantidad);
            await producto.save();

            productosComprados.push({
                referencia: producto.Referencia,
                descripcion: producto.Descripcion,
                cantidad: item.cantidad,
                precioUnitario: producto.Precio,
            });
        }

        const nuevaCompra = new Compras({
            proveedor, 
            productos: productosComprados,
            totalCompra,
            fecha: new Date()
        });

        await nuevaCompra.save();

        res.status(200).json({
            mensaje: 'Compra realizada con éxito.',
            compra: nuevaCompra
        });

    } catch (error) {
        console.error('Error al procesar la compra:', error);
        res.status(500).json({
            mensaje: 'Error interno del servidor.',
            error: error.message
        });
    }
};
