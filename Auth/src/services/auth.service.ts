import { Request, Response } from "express";
import { Token } from "../interfaces/token.interface";
import { LoginResponse, LoginUser, RegisterUser } from "../interfaces/user.interface";
import User from "../models/User";
import Session from "../models/session";
import { randomUUID } from 'crypto';
import { HttpResponse } from "../interfaces/http.interface";

export class AuthService {

    static async login(user: LoginUser, req: Request, res: Response): Promise<LoginResponse | HttpResponse> {
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
            if(getUser.session?.token) {
                // get the token and verify if is not expired
                if (await Session.verifySession(getUser.session?.token as string, getUser.user_id)) return {
                    status: 400,
                    message: "ALREADY_LOGGED_IN_OR_SESSION_EXPIRED"
                };
            }

            const matchPass = await User.comparePassword(user.password, getUser.password);

            if (matchPass) {
                // generate refresh token to identify the session
                const generateRefreshToken: boolean | string = await Session.generateRefreshToken(getUser.user_id, res);
                // generate a token to authenticate the user
                const genToken = await Session.generateToken(getUser.user_id);

                if (!generateRefreshToken) return {
                    status: 500,
                    message: "INTERNAL_SERVER_ERROR"
                }

                // create a session with refresh token
                const session = await Session.createSession(getUser.user_id, genToken, generateRefreshToken as string, req.ip, req.headers['user-agent']);
                
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
        // delete the session
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

