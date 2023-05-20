import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Session from "../models/session.model";
import { asyncHandler } from "../helpers/asyncHandler";


interface jwtPayload {
    id: string;
}

export const check_refresh_token = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const token = req.cookies?.refresh_token;
    // console.log(req.cookies)
    // console.log(req.cookies?.refresh_token)
    // return res.json({
    //     ok: true
    // })

    if(!token) return res.status(400).json({
        code: 400,
        msg: "NO_TOKEN_PROVIDED"
    })

    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as jwtPayload;

    req.user_id = id;
    next();
});

export const check_token = asyncHandler(async (req: any, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.status(400).json({
        code: 400,
        msg: "NO_TOKEN_PROVIDED"
    });

    const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as jwtPayload;
    if(id) {
        const session = await Session.verifySession(token, id);

        if(!session) return res.status(400).json({
            code: 400,
            msg: "INVALID_TOKEN"
        });

        req.user_id = id;
        next();
        
        return;
    }

    return res.send("OK")
});