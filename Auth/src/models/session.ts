import { HasMany, HasOne, BeforeCreate, BeforeUpdate, BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import User from './User';
import { DataTypes } from 'sequelize';
import jwt from 'jsonwebtoken';

@Table({
    tableName: 'users.session',
    timestamps: true
})
export class Session extends Model {
    @Column({
        type: 'uuid',
        allowNull: false,
    })
    @ForeignKey(() => User)
    user_id: string;

    @Column({
        type: DataTypes.STRING,
    })
    token: string;

    @Column({
        type: DataTypes.STRING,
    })
    ip: string;

    @Column({
        type: DataTypes.STRING,
    })
    device: string;

    static async generateToken(user: User): Promise<string> {
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET as string, {
            expiresIn: '7d'
        });

        return token;
    }

    static async createSession(user_id: string, token: string, ip: string | undefined, device: string | undefined): Promise<Session> {
        const session = await Session.create({
            user_id,
            token,
            ip,
            device,
        });

        return session;
    }

    static async deleteSession(token: string): Promise<boolean> {
        const session = await Session.findOne({
            where: {
                token,
            }
        });

        if (session) {
            await session.destroy();
            return true;
        }

        return false;
    }

    static async verifySession(token: string, user: User): Promise<User |boolean> {
        const validate = await Session.findOne({
            where: {
                token,
                user_id: user.user_id,
            }
        })

        if (!validate) return false

        return user;
    }
}

export default Session;