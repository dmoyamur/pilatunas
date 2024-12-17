import { Router } from "express";

import { crearProducto, verificarProducto, modificarProducto, eliminarProducto, obtenerProductos,  obtenerHistorialProductos } from "../controllers/productController.js";

import { crearTercero, verificarTercero, modificarTercero, eliminarTercero, obtenerTerceros } from "../controllers/tercerosController.js";
import { crearVenta, generarReporteVentas } from "../controllers/ventasController.js";
import { obtenerUsuarios } from "../controllers/userController.js";
import { comprarProductos, generarReporteCompras } from "../controllers/comprasController.js";
import { ajusteProducto } from "../controllers/ajusteController.js";
import { generarReporte } from "../controllers/reportesMovimientosControllers.js";
import { generarReporteSaldos } from "../controllers/saldosController.js";

const router = Router();


// Ruta de la pagina principal con el login
router.get("/", (req, res) => {
    res.render("index");
  });


// Ruta para el menu principal
router.get("/menu", (req, res) => {
    res.render("menu");
});


// Ruta para la gestion de usuarios
router.get("/gestionUsuarios", (req, res) => {
  res.render("gestionUsuarios");
});


// Ruta para la gestion de productos
router.get("/productos" , (req, res) => {
  res.render("productos");
});

// Ruta para la gestion de terceros
router.get("/terceros", (req, res) => {
  res.render("terceros");
});


// Ruta para la gestion de ventas
router.get('/ventas', (req, res) => {
  res.render("ventas");
});

// Ruta para los reportes de ventas
router.get('/reporte-ventas', (req, res) => {
  res.render("reportesVentas");
});

// Ruta para el reporte de productos
router.get('/reporte-productos', (req, res) => {
  res.render("reportesProductos");
});

// Ruta para realizar compras
router.get('/compras', (req, res) => {
  res.render("compras");
});

// Ruta para realizar ajustes
router.get('/ajustes', (req, res) => {
  res.render("ajustes");
});

// Ruta para ver reporte de movimientos
router.get('/reporte-movimientos', (req, res) => {
  res.render("reportesMovimientos")
})

// Ruta para ver reporte de saldos 
router.get('/reporte-saldos', (req, res) => {
  res.render("reporteSaldos");
});

// Ruta para ver reportes de compras
router.get('/reporte-compras', (req, res) => {
  res.render("reporteCompras");
});

router.post('/ajusteProducto', ajusteProducto);
router.post('/crear-producto', crearProducto);
router.get('/verificar-producto/:referencia', verificarProducto);
router.put('/modificar-producto/:referencia', modificarProducto);
router.delete('/eliminar-producto/:referencia', eliminarProducto);


router.post('/crear-tercero', crearTercero);
router.get('/verificar-tercero/:nit', verificarTercero);
router.put('/modificar-tercero/:nit', modificarTercero);
router.delete('/eliminar-tercero/:nit', eliminarTercero);


router.post('/crear-venta', crearVenta);

router.get('/obtener-usuarios', obtenerUsuarios);



router.get('/obtener-productos', obtenerProductos);

router.get('/obtener-terceros', obtenerTerceros);

router.get('/reporte-ventas/:fechaInicio/:fechaFin', generarReporteVentas);
router.post('/reporte-productos', obtenerHistorialProductos); 

router.post('/comprar-productos', comprarProductos);


router.get('/reporte-movimientos/:fechaInicio/:fechaFin/:productoRef', generarReporte);

router.get('/reporte-saldos/:fechaCorte', generarReporteSaldos);

router.get('/reporte-compras/:fechaInicio/:fechaFin', generarReporteCompras);




export default router;
