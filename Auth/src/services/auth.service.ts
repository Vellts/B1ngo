import { Request } from "express";
import { Token } from "../interfaces/token.interface";
import { LoginResponse, LoginUser, RegisterUser } from "../interfaces/user.interface";
import User from "../models/User";
import Session from "../models/session";
import { randomUUID } from 'crypto';

export class AuthService {

    static async login(user: LoginUser, req: Request): Promise<LoginResponse | boolean> {
        // console.log(user.email)
        const getUser = await User.findOne({
            where: {
                email: user.email
            }
        })


        // console.log(`Ip: ${req.ip}`, `User Agent: ${req.headers['user-agent']}`)
        // console.log(getUser)
        if (getUser) {

            // if (!getUser.isActive) return false;

            const matchPass = await User.comparePassword(user.password, getUser.password);

            if (matchPass) {
                const genToken = await Session.generateToken(getUser);
                const session = await Session.createSession(getUser.user_id, genToken, req.ip, req.headers['user-agent']);
                // console.log(session)
                
                return {
                    user: getUser,
                    token: session
                }
            };
        }

        return false
    }
}