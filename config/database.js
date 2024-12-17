import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
<<<<<<< HEAD
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:pilatunas@cluster0.oq7cr.mongodb.net/pilatunas_db');
=======
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://julianhomezdev:M1oDnsbIo4HJ37a6@cluster0.kwqwh.mongodb.net/pilatunas_db');
>>>>>>> 73639e3310ccb3bc2cddfb5115ea6545590a94df
        console.log(`MongoDB conectado: ${conn.connection.host}`);
        
        mongoose.connection.on('error', (err) => {
            console.error('Error de MongoDB:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB desconectado');
        });

    } catch (error) {
        console.error('Error detallado:', error);
        console.error('Stack trace:', error.stack);
    }
};
