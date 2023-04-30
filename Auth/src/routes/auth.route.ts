/**
 * @swagger
 * components:
 *   schemas:
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email of your user
 *         password:
 *           type: string
 *           description: The password of your user
 *       example:
 *         email: b1ngo@email.com
 *         password: 123456
 *     Logout:
 *       type: object
 *       required:
 *         - token
 *         - user_id
 *       properties:
 *         token:
 *           type: string
 *           description: The token of your user
 *         user_id:
 *           type: string
 *           description: The id of your user
 *       example:
 *         token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImY3MmRkYWU2LTZjNzEtNDU0NC05Mzc2LTljYzI4ZDVlZTc1ZSIsImlhdCI6MTY4Mjg4ODYwMSwiZXhwIjoxNjgzNDkzNDAxfQ.x54OEZWbfbaJKmum1kh7fKX7iRwHeZBKGX9CIZklWR4
 *         user_id: f72ddae6-6c71-4544-9376-9cc28d5ee75e
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 * /login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: El email del usuario.
 *       - in: path
 *         name: password
 *         schema:
 *           type: string
 *         required: true
 *         description: La contraseña del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: El modelo del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Login'
 *       500:
 *         description: Error interno del servidor.
 * /logout:
 *   get:
 *     summary: Cierra sesión de un usuario
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: El token del usuario.
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: string
 *         required: true
 *         description: El id del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Logout'
 *     responses:
 *       200:
 *         description: Cierre de sesión exitoso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Logout'
 *       500:
 *         description: Error interno del servidor.
 */

import { Router } from "express";
import { loginController, logoutController } from "../controllers/auth.controller";
import User from "../models/User";
import { loginMiddleware } from "../middlewares/login.middleware";
import { check_token } from "../middlewares/token.middleware";


const routes = Router();

routes.post('/login', loginMiddleware, loginController);
routes.get('/logout', check_token, logoutController)
routes.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const id = 'f72ddae6-6c71-4544-9376-9cc28d5ee75e'

    const user = {
        user_id: id,
        username,
        email,
        password,
    }

    const add = await User.create(user);

    return res.status(200).json({
        code: 200,
        msg: "REGISTER_SUCCESS",
        data: add
    })
})

export default routes;