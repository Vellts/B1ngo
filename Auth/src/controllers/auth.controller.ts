import { Request, Response } from "express"
import { asyncHandler } from "../helpers/asyncHandler"
import User from "../models/User"
import { AuthService } from "../services/auth.service"
import { LoginResponse } from "../interfaces/user.interface"

export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const data: LoginResponse | boolean = await AuthService.login({ email, password }, req)

    if (typeof(data) == 'boolean') {
        return res.status(400).json({
            code: 400,
            msg: "INVALID_CREDENTIALS"
        })
    }
    
    return res.status(200).json({
        code: 200,
        msg: "LOGIN_SUCCESS",
        data
    })
})