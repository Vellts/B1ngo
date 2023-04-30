import { Request, Response } from "express"
import { asyncHandler } from "../helpers/asyncHandler"
import User from "../models/User"
import { AuthService } from "../services/auth.service"
import { LoginResponse } from "../interfaces/user.interface"
import { HttpResponse } from "../interfaces/http.interface"

export const loginController = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body

    const data: LoginResponse | HttpResponse = await AuthService.login({ email, password }, req)


    if ('status' in data) {
        return res.status(data.status).json({
            code: data.status,
            msg: data.message
        })
    }

    return res.status(200).json({
        code: 200,
        msg: "LOGIN_SUCCESS",
        data
    })
})

export const logoutController = asyncHandler(async (req: any, res: Response) => {
    const token = req.headers.authorization?.split(' ')[1]

    const data: boolean = await AuthService.logout(token, req.user_id)

    if (data) {
        req.user_id = null

        return res.status(200).json({
            code: 200,
            msg: "LOGOUT_SUCCESS"
        })
    }

    return res.status(400).json({
        code: 400,
        msg: "LOGOUT_FAILED"
    })
})