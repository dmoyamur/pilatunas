import Terceros from "../models/Terceros.js";



export const obtenerTerceros = async (req, res) => {
    try {
        const terceros = await Terceros.find({ activo: true }, {
            nit: 1,
            nombre: 1,
            direccion: 1,
            telefono: 1,
            ciudad: 1,
            email: 1,
        });
        res.json(terceros);
        console.log("TERCEROS EN EL CONTROLADOR");
        console.log(terceros);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener terceros", error: error.message });
    }
};


export const crearTercero = async (req, res) => {
    try {
        const { nit, nombre, direccion, telefono, ciudad, email, activo } = req.body;

        const terceroExistente = await Terceros.findOne({ nit });

        if (terceroExistente) {
            return res.status(400).json({
                message: 'Ya existe un tercero con este NIT',
            });
        }

        const nuevoTercero = new Terceros({
            nit,
            nombre,
            direccion,
            telefono,
            ciudad,
            email,
            activo
        });

        await nuevoTercero.save();

        return res.status(201).json({
            message: 'Tercero creado exitosamente',
            tercero: nuevoTercero
        });

    } catch (error) {
        console.error('Error al crear tercero:', error);
        return res.status(500).json({
            message: 'Error del servidor',
        });
    }
};

export const verificarTercero = async (req, res) => {
    try {
        const { nit } = req.params;

        console.log('NIT recibido:', nit);

        const tercero = await Terceros.findOne({ nit: nit });

        if (!tercero) {
            return res.status(404).json({
                message: 'Tercero no encontrado',
            });
        }

        return res.status(200).json({
            message: 'Tercero encontrado',
            tercero: tercero
        });

    } catch (error) {
        console.error('Error al verificar tercero:', error);
        return res.status(500).json({
            message: 'Error del servidor',
        });
    }
};

export const modificarTercero = async (req, res) => {
    try {
        const { nit } = req.params;
        const actualizaciones = req.body;

        console.log('NIT recibido:', nit);
        console.log('Datos de actualización:', actualizaciones);

        const terceroActualizado = await Terceros.findOneAndUpdate(
            { nit: nit },
            actualizaciones,
            { new: true } 
        );

        if (!terceroActualizado) {
            return res.status(404).json({
                message: 'Tercero no encontrado',
            });
        }

        return res.status(200).json({
            message: 'Tercero modificado exitosamente',
            tercero: terceroActualizado
        });

    } catch (error) {
        console.error('Error al modificar tercero:', error);
        return res.status(500).json({
            message: 'Error del servidor',
        });
    }
};

export const eliminarTercero = async (req, res) => {
    try {
        const { nit } = req.params;
        
        console.log('NIT recibido:', nit);

        const tercero = await Terceros.findOne({ nit: nit });

        if (!tercero) {
            return res.status(404).json({
                message: 'Tercero no encontrado',
            });
        }

        await tercero.deleteOne();

        return res.status(200).json({
            message: 'Tercero eliminado exitosamente',
        });
    } catch (error) {
        console.error('Error al eliminar tercero:', error);
        return res.status(500).json({
            message: 'Error del servidor',
        });
    }
};