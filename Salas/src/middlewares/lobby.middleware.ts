import joi from 'joi'
import { asyncHandler } from '../helpers/asyncHandler'


export const lobbyChecker = asyncHandler(async (req: any, res: any, next: any) => {
    const object = joi.object({
        lobby_name: joi.string().required().min(4).max(12).optional(),
        lobby_password: joi.string().required().min(6).max(20).optional()
    })

    const { error } = object.validate(req.body);

    if(error) return res.status(400).json({
        code: 400,
        msg: error.details[0].message
    })

    next();
});