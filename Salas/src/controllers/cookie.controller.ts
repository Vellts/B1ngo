import { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../helpers/asyncHandler";
import jwt from "jsonwebtoken";
import { HttpResponse } from "../interfaces/http.interface";
import { LobbyService } from "../services/lobby.service";

export const cookieController = asyncHandler(async (req: any, res: any) => {
    const { refresh_token } = req.body;

    const data: HttpResponse | boolean = await LobbyService.getCookieAuth(refresh_token, res);

    return res.status(data.status).json({
        code: data.status,
        msg: data.message
    });
});