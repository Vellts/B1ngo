import { Request } from "express";
import { Token } from "../interfaces/token.interface";
import { LoginResponse, LoginUser, RegisterUser } from "../interfaces/user.interface";
import User from "../models/User";
import Session from "../models/session";
import { randomUUID } from 'crypto';
import { HttpResponse } from "../interfaces/http.interface";


export class AuthService {

    static async login(user: LoginUser, req: Request): Promise<LoginResponse | HttpResponse> {
        // console.log(user.email)
        const getUser = await User.findOne({
            where: {
                email: user.email
            },
            include: [
                {
                    model: Session,
                }
            ]
        })

        if (getUser) {

            // if (!getUser.isActive) return false;
            if (!getUser.accountActivated) return {
                status: 400,
                message: "ACCOUNT_NOT_ACTIVATED"
            };
            // if(await Session.verifySession(getUser.session?.token as string, getUser.user_id)) return {
            //     status: 400,
            //     message: "ALREADY_LOGGED_IN"
            // };
            if(getUser.session?.token) {
                if (await Session.verifySession(getUser.session?.token as string, getUser.user_id)) return {
                    status: 400,
                    message: "ALREADY_LOGGED_IN"
                };
            }

            const matchPass = await User.comparePassword(user.password, getUser.password);

            if (matchPass) {
                const genToken = await Session.generateToken(getUser.user_id);
                const session = await Session.createSession(getUser.user_id, genToken, req.ip, req.headers['user-agent']);
                // console.log(session)
                
                return {
                    user: getUser,
                    session
                }
            };
        }
        
        return {
            status: 400,
            message: "INVALID_CREDENTIALS"
        }
    }

    static async logout(token: string, user_id: string): Promise<boolean> {
        const deleteSession = await Session.deleteSession(token, user_id);

        return deleteSession;
    }
    static async register(user: RegisterUser): Promise<User | boolean> {
        const emailExists = await User.emailExists(user.email);
        const userExists = await  User.userExists(user.username)
        if (!emailExists && !userExists) {
            const userSave = {
                user_id: randomUUID(),
                username:user.username,
                email:user.email,
                password:user.password,
                rol: "user",
                isActive: true,
                accountActivated:true

            }
            const newUser = await User.create(userSave);
            return newUser;
          }
          return false;
        }
}

