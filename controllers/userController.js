import {Usuario} from '../models/Usuarios.js';


export const loginUser = async (req, res) => {
    try {
        const {usuario, clave} = req.body;

        //console.log("Usuario:", usuario);
        //console.log("Clave:", clave);

        if(!usuario || !clave) {
            console.log("Campos incompletos");
            return res.status(400).json({ message: "Por favor llena los campos obligatorios para el login"});
        }

        const userCreated = await Usuario.findOne({ Usuario: usuario });
        

        if (!userCreated) {
            console.log("Usuario no encontrado");
            return res.status(404).json({ message: "El usuario no existe" });
        }

        if (clave !== userCreated.Clave) {
            console.log("Contraseña incorrecta");
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Login exitoso
        res.status(200).json({ 
            message: "Inicio de sesión exitoso",
            usuario: {
                id: userCreated._id,
                nombre: userCreated.name,
                usuario: userCreated.Usuario
            }
        });

    } catch (error) {
        console.error("Error completo:", error);
        res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
}


export const registerUser = async (req, res) => {
    try {
        const { usuario, clave, nombre, correo } = req.body;

        if (!usuario || !clave) {
            return res.status(400).json({ success: false, message: "Por favor llena los campos obligatorios" });
        }

        const userExists = await Usuario.findOne({ Usuario: usuario });
        if (userExists) {
            return res.status(400).json({ success: false, message: "El usuario ya está registrado" });
        }

        const user = new Usuario({ Usuario: usuario, Clave: clave, name: nombre, email: correo });

        await user.save();

        return res.status(201).json({ 
            success: true,
            message: `Usuario ${user.Usuario} registrado con éxito`,
            user: {
                usuario: user.Usuario,
                nombre: user.name,
                correo: user.email
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Error en el servidor" });
    }
};

export const verifyUser = async (req, res) => {
    try {
        const { usuario, clave } = req.body;

        if (!usuario || !clave) {
            return res.status(400).json({ 
                message: "Por favor llena todos los campos" 
            });
        }

        const userExists = await Usuario.findOne({ Usuario: usuario });

        if (!userExists) {
            return res.status(404).json({ 
                message: "El usuario no existe" 
            });
        }

        if (userExists.Clave !== clave) {
            return res.status(401).json({ 
                message: "Contraseña incorrecta" 
            });
        }

        res.status(200).json({ 
            message: "Usuario verificado correctamente" 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error en el servidor" 
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { usuario, nuevoUsuario, nuevaClave } = req.body;

        if (!nuevoUsuario && !nuevaClave) {
            return res.status(400).json({ 
                message: "No hay cambios para realizar" 
            });
        }

        const updateData = {};
        
        if (nuevoUsuario) {
            const usuarioExistente = await Usuario.findOne({ 
                Usuario: nuevoUsuario 
            });
            
            if (usuarioExistente) {
                return res.status(400).json({ 
                    message: "El nuevo nombre de usuario ya está en uso" 
                });
            }
            
            updateData.Usuario = nuevoUsuario;
        }

        if (nuevaClave) {
            updateData.Clave = nuevaClave;
        }

        const usuarioActualizado = await Usuario.findOneAndUpdate(
            { Usuario: usuario },
            updateData,
            { new: true }
        );

        if (!nuevoUsuario) {
            return res.status(404).json({ 
                message: "Usuario no encontrado" 
            });
        }

        res.status(200).json({ 
            message: "Usuario actualizado correctamente",
            usuario: usuarioActualizado
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: "Error en el servidor" 
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { usuario } = req.body;

        if (!usuario) {
            return res.status(400).json({
                message: "Por favor, proporciona el nombre de usuario a eliminar."
            });
        }

        // Buscar y eliminar el usuario
        const usuarioEliminado = await Usuario.findOneAndDelete({ Usuario: usuario });

        if (!usuarioEliminado) {
            return res.status(404).json({
                message: "Usuario no encontrado."
            });
        }

        res.status(200).json({
            message: `Usuario '${usuarioEliminado.Usuario}' eliminado correctamente.`
        });
    } catch (error) {
        console.error("Error eliminando usuario:", error);
        res.status(500).json({
            message: "Error en el servidor",
            error: error.message
        });
    }
};


export const obtenerUsuarios = async (req, res) => {

    try {

        const usuarios = await Usuario.find({ Activo: true}, {

            Usuario: 1,
            Clave: 1,
            _id: 0
        }) ;

        res.json(usuarios);

    } catch (error) {
        res.status(500).json({
            message: "Error al obtener los usuarios", error: error.message
        });
    }
};






export default {registerUser, loginUser, updateUser, verifyUser, deleteUser, obtenerUsuarios};
