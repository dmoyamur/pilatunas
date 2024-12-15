import app from './app.js';
import { connectDB } from './config/database.js';

// Conexión a la base de datos
(async () => {
    try {
        await connectDB();
        console.log('Conexión a la base de datos establecida');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        process.exit(1); 
    }
})();

// Puerto para iniciar el servidor
const PORT = process.env.PORT || 3000;


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`); 
    next();
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
