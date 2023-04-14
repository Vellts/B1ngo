import { LoginUser } from "../interfaces/user.interface";
import User from "../models/User";

export class AuthService {

    constructor() {}
    
    static async login(user: LoginUser): Promise<User | boolean> {
        const getUser = await User.findOne({
            where: {
                email: user.email
            }
        })


        if (getUser) {
            const matchPass = await User.comparePassword(user.password, getUser.password);

            if (matchPass) return getUser;
        }

        return false
    }
}