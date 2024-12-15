import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { engine } from 'express-handlebars';
import authRoutes from './routes/auth.routes.js'; 
import defaultRoutes from './routes/index.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear instancia de Express
const app = express();

// Configuración del motor de plantillas Handlebars
app.engine('hbs', engine({
  extname: '.hbs', // Extensión de archivos de plantilla
  defaultLayout: 'main', // Layout principal
  layoutsDir: path.join(__dirname, 'views/layouts'), // Ruta de layouts
  partialsDir: path.join(__dirname, 'views/partials'), // Ruta de partials
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', authRoutes);
app.use('/', defaultRoutes);


export default app;
