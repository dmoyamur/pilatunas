import { Router } from "express";
import { registerUser , loginUser, verifyUser, updateUser, deleteUser, obtenerUsuarios } from "../controllers/userController.js";


const router = Router();




// Ruta de la pagina principal con el login
router.get("/", (req, res) => {
    res.render("index",{
        title: "Login"
    }
    );
  });
  

// Ruta para el login
router.post("/login", loginUser);

// Ruta para pagina crear cuenta
router.get("/signup", (req, res) => {
    res.render("signup", {
        title: "Sign Up"
    });
});






// Ruta para crear usuario
router.post('/signup', registerUser);

router.post('/verify-user', verifyUser);

router.delete('/delete-user', deleteUser);


router.delete('/obtener-usuarios', obtenerUsuarios);





export default router;
