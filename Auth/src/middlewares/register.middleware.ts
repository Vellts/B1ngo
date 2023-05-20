
import Joi from "joi";
import { Request, Response, NextFunction } from "express";

export const registerMiddleware = (req: Request, res: Response, next: NextFunction): void | Response => {
    const { email, password, username } = req.body;


    const validate = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        username:Joi.string().required()
    })

    const { error } = validate.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        })
    }

    next();
};