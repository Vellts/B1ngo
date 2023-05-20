import { asyncHandler } from "../helpers/asyncHandler";
import { HttpResponse } from "../interfaces/http.interface";
import { TokenService } from "../services/token.service";

export const get_token = asyncHandler(async (req: any, res: any) => {
    const { user_id } = req;
    // get token from the session
    const data: HttpResponse | string = await TokenService.get_token(user_id);

    if (typeof data !== 'string') return res.status(data.status).json({ ok: false, message: data.message });

    return res.status(200).json({ msg: "TOKEN_FOUND", token: data });
});