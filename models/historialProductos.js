import mongoose from 'mongoose';

const HistorialProductosSchema = new mongoose.Schema({
    tipoOperacion: {
        type: String,
        enum: ['CREACION', 'MODIFICACION', 'ELIMINACION'],
        required: true
    },
    producto: {
        referencia: { type: String, required: true },
        descripcion: { type: String, required: true },
        precio: { type: Number, required: true },
        cantidad: { type: Number, required: true }
    },
    fechaOperacion: {
        type: Date,
        default: Date.now
    },
    usuarioResponsable: {
        type: String,
        default: 'Sistema'
    }
});

const HistorialProductos = mongoose.model('HistorialProductos', HistorialProductosSchema);

export default HistorialProductos;