import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const loginMiddleware = (req: Request, res: Response, next: NextFunction): void | Response => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email or password is missing"
        });
    }

    const validate = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    const { error } = validate.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next();
};