import User from "../models/User";
import Session from "../models/session";

export interface LoginUser {
    email: string;
    password: string;
}

export interface LoginResponse {
    user: User;
    session: Session;
}

export interface RegisterUser{
    email: string;
    username:string;
    password:string;
}