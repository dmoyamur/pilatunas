import Productos from "../models/Productos.js";
import HistorialProductos from "../models/historialProductos.js";

export const crearProducto = async (req, res) => {
    try {
        const { referencia, descripcion, precio, activo } = req.body;
        
        if (!referencia || !descripcion || !precio) {
            return res.status(400).json({ message: "Por favor llena los campos obligatorios" });
        }
        
        const productExists = await Productos.findOne({ Referencia: referencia });
        if (productExists) {
            return res.status(400).json({ message: "La referencia de producto ya está registrada" });
        }
        
        const producto = new Productos({
            Referencia: referencia,
            Descripcion: descripcion,
            Precio: parseFloat(precio),
            Cantidad: 0, // Siempre inicia en 0
            Activo: activo === 'true' || true
        });
        
        await producto.save();
        
        try {
            const historialCreado = await HistorialProductos.create({
                tipoOperacion: 'CREACION',
                producto: {
                    referencia: producto.Referencia,
                    descripcion: producto.Descripcion,
                    precio: producto.Precio,
                    cantidad: producto.Cantidad
                }
            });
            console.log('Historial de creación guardado:', historialCreado);
        } catch (historialError) {
            console.error('Error al guardar historial de creación:', historialError);
        }
        
        res.status(201).json({ message: `Producto ${producto.Referencia} creado con éxito` });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ 
            message: "Error en el servidor al crear el producto",
            error: error.message 
        });
    }
};

export const modificarProducto = async (req, res) => {
    try {
        const { referencia } = req.params;

        const producto = await Productos.findOne({ Referencia: referencia });

        if (!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado',
            });
        }

        const { descripcion, costo, activo, cantidad } = req.body;

        // Verifica si todos los datos requeridos están presentes
        if (!descripcion || !costo) {
            return res.status(400).json({
                message: 'Por favor complete todos los campos requeridos',
            });
        }

        const estadoAnterior = { ...producto.toObject() };

        producto.Descripcion = descripcion;
        producto.Precio = parseFloat(costo);
        producto.Activo = activo === 'true'; 
        producto.Cantidad = cantidad;

        await producto.save();

        try {
            const historialCreado = await HistorialProductos.create({
                tipoOperacion: 'MODIFICACION',
                producto: {
                    referencia: producto.Referencia,
                    descripcion: producto.Descripcion,
                    precio: producto.Precio,
                    cantidad: producto.Cantidad
                }
            });
            console.log('Historial de modificación guardado:', historialCreado);
        } catch (historialError) {
            console.error('Error al guardar historial de modificación:', historialError);
        }

        return res.status(200).json({
            message: 'Producto modificado exitosamente',
            producto,
        });
    } catch (error) {
        console.error('Error al modificar producto:', error);
        return res.status(500).json({
            message: 'Error del servidor',
        });
    }
};

export const eliminarProducto = async (req, res) => {
    try {
        const { referencia } = req.params;
        
        console.log('Referencia recibida:', referencia);

        // Verificar si el producto existe 
        const producto = await Productos.findOne({ Referencia: referencia });

        if (!producto) {
            return res.status(404).json({
                message: 'Producto no encontrado',
            });
        }

        try {
            const historialCreado = await HistorialProductos.create({
                tipoOperacion: 'ELIMINACION',
                producto: {
                    referencia: producto.Referencia,
                    descripcion: producto.Descripcion,
                    precio: producto.Precio,
                    cantidad: producto.Cantidad
                }
            });
            console.log('Historial de eliminación guardado:', historialCreado);
        } catch (historialError) {
            console.error('Error al guardar historial de eliminación:', historialError);
        }

        // Eliminar el producto
        await producto.deleteOne();

        return res.status(200).json({
            message: 'Producto eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return res.status(500).json({
            message: 'Error del servidor',
        });
    }
};

// Controlador para obtener el historial de productos
export const obtenerHistorialProductos = async (req, res) => {
    try {
        const historial = await HistorialProductos.find()
            .sort({ fechaOperacion: -1 })
            .limit(100);

        return res.status(200).json(historial);
    } catch (error) {
        console.error('Error al obtener historial de productos:', error);
        return res.status(500).json({
            message: 'Error del servidor al obtener el historial',
            error: error.message
        });
    }
};

export const verificarProducto = async (req, res) => {
    try {
        const { referencia } = req.params;

        if (!referencia) {
            return res.status(400).json({ 
                message: "La referencia es requerida" 
            });
        }

        const producto = await Productos.findOne({ Referencia: referencia });

        // Si no existe el producto
        if (!producto) {
            return res.status(404).json({ 
                message: "Producto no encontrado",
                producto: null
            });
        }

        res.status(200).json({
            message: "Producto encontrado",
            producto: {
                referencia: producto.Referencia,
                descripcion: producto.Descripcion,
                costo: producto.Precio,
                activo: producto.Activo,
                cantidad: producto.Cantidad
            }
        });

    } catch (error) {
        console.error('Error al verificar producto:', error);
        res.status(500).json({
            message: "Error en el servidor al verificar el producto",
            error: error.message
        });
    }
};



export const obtenerProductos = async (req, res) => {
    try {
        const productos = await Productos.find({ Activo: true }, {
            Referencia: 1,
            Descripcion: 1,
            Cantidad: 1,
            Precio: 1,
            _id: 0
        });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos", error: error.message });
    }
};
export default {
    eliminarProducto, 
    verificarProducto, 
    crearProducto, 
    modificarProducto, 
    obtenerProductos, 
    obtenerHistorialProductos
};