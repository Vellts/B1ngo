import { LoginUser } from "../interfaces/user.interface";
import User from "../models/User";

/**
 * @description Servicio de autenticación
 * @class AuthService
 * @method login
 * @method register
 * @method logout
 */
export class AuthService {

    constructor() {}
    
    /**
     * @description Inicia sesión de un usuario
     * @param user Objeto con los datos del usuario
     * @returns UserModel | boolean
     */
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