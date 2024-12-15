import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://atlas-sql-674f90d21e0232215de0fdd9-oq7cr.a.query.mongodb.net/Pilatunas?ssl=true&authSource=admin');
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