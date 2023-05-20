import { Request, Response } from "express";
import { asyncHandler } from "../helpers/asyncHandler";
import { HttpResponse } from "../interfaces/http.interface";
import { Model } from "sequelize";
import { LobbyService } from "../services/lobby.service";

export const createLobbyController = asyncHandler(async (req: any, res: Response) => {
    const { lobby_name, lobby_password } = req.body;
    const user_id = req.user_id;

    const data: HttpResponse | Model = await LobbyService.createLobby(user_id, lobby_name, lobby_password);

    if ('status' in data) {
        return res.status(data.status).json({
            code: data.status,
            msg: data.message
        });
    }

    return res.status(200).json({
        code: 200,
        msg: "LOBBY_CREATED",
        data
    })
});

// generate a random lobby id of 6 characters