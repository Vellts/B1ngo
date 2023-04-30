import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import Session from "../models/session";
import { asyncHandler } from "../helpers/asyncHandler";

interface jwtPayload {
    id: string;
}

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

// export const check_token = async (req: any, res: Response, next: NextFunction) => {
    // const token = req.headers['authorization']?.split(' ')[1];
    // console.log(token)
    // if (!token) return res.status(400).json({
    //     code: 400,
    //     msg: "NO_TOKEN_PROVIDED"
    // });

    // const { id } = jwt.verify(token, process.env.JWT_SECRET as string) as jwtPayload;

    // if(id) {
    //     const check_session = await Session.verifySession(token, id);

    //     if(check_session) {
    //         req.user = id;
    //         next();
    //     } else {
    //         return res.status(400).json({
    //             code: 400,
    //             msg: "INVALID_TOKEN"
    //         });
    //     }
    // }

    // return res.status(400).json({
    //     code: 400,
    //     msg: "INVALID_TOKEN"
    // });
// };