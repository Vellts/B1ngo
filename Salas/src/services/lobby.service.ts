import { create } from "ts-node";
import { HttpResponse } from "../interfaces/http.interface";
import Lobby from "../models/lobby.model";
import { randomUUID } from 'crypto';
import { Model, Op } from "sequelize";
import { generateLobbyId } from "../helpers/uuid";

export class LobbyService {

    static async createLobby(user_id: string, lobby_name: string, lobby_password: string): Promise<HttpResponse | Model> {
        let exists: Model | null = null;
        if (!lobby_name) {
            exists = await Lobby.findOne({
                where: {
                    lobby_owner: user_id
                }
            });
        } else {
            exists = await Lobby.findOne({
                where: {
                    [Op.or]: [
                        {
                            lobby_name
                        },
                        {
                            lobby_owner: user_id
                        }
                    ]
                }
            });
        }

        if(exists) return {
            status: 400,
            message: "LOBBY_EXISTS_OR_USER_ALREADY_HAS_LOBBY"
        }

        const create_lobby = await Lobby.create({
            lobby_id: generateLobbyId(),
            lobby_name,
            lobby_password,
            lobby_owner: user_id
        })

        return create_lobby
    }
}