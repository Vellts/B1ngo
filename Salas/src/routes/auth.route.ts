import { Router } from "express";
import { loginController } from "../controllers/auth.controller";
import User from "../models/User";

const routes = Router();

routes.post('/login', loginController);
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