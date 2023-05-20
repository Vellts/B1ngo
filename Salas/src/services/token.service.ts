import { HttpResponse } from "../interfaces/http.interface";
import Session from "../models/session.model";

export class TokenService {
    static async get_token(user_id: string): Promise<HttpResponse | string> {
        const get_token: string | boolean = await Session.findToken(user_id);

        if (!get_token) return {
            status: 400,
            message: "TOKEN_NOT_FOUND"
        }

        // validate if the token is expired
        const check_token = await Session.verifySession(get_token as string, user_id);
        if (!check_token) return {
            status: 400,
            message: "TOKEN_EXPIRED"
        }

        return get_token as string;
    }
}