import { HasMany, HasOne, BeforeCreate, BeforeUpdate, BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import User from './user.model';
import { DataTypes } from 'sequelize';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

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
    refresh_token: string;

    @Column({
        type: DataTypes.STRING,
    })
    token: string;

    @Column({
        type: DataTypes.STRING,
        validate: {
            isIP: true,
        }
    })
    ip: string;

    @Column({
        type: DataTypes.STRING,
    })
    device: string;

    @Column({
        type: DataTypes.DATE,
    })
    expires_at: Date;

    @BelongsTo(() => User)
    user: User;
 
    static async generateRefreshToken(user_id: string, res: Response): Promise<string | boolean> {
        try {
            const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET as string, {
                expiresIn: '7d'
            })

            const cookie = res.cookie('refresh_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                // expires in 30 minutes
                expires: new Date(Date.now() + 1 * 60 * 1000)
            })

            return token;
        } catch (error) {
            return false
        }
    }

    static async generateToken(user_id: string): Promise<string> {
        const token = jwt.sign({ id: user_id }, process.env.JWT_SECRET as string, {
            expiresIn: '5m'
        });

        return token;
    }

    static async createSession(user_id: string, token: string, refresh_token: string, ip: string | undefined, device: string | undefined): Promise<Session> {
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const session = await Session.create({
            user_id,
            token,
            refresh_token,
            ip,
            device,
            expires_at,
        });

        return session;
    }

    static async deleteSession(token: string, user_id: string): Promise<boolean> {
        const session = await Session.findOne({
            where: {
                token,
                user_id: user_id,
            }
        });

        if (session) {
            await session.destroy();
            return true;
        }

        return false;
    }

    static async verifySession(token: string, user_id: string): Promise<boolean> {
        
        try {
            
            const validate = await Session.findOne({
                where: {
                    token,
                    user_id: user_id,
                }
            })

            if (validate) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    
                // verify if the token is not expired
    
                if (decoded.id !== user_id) return false;
    
                return true;
            }
            return false;
        } catch (error: any) {
            // caught if is expired
            if (error.name === 'TokenExpiredError') {
                // delete the session and destroy the token
                const deleteSession = await Session.deleteSession(token, user_id);
                console.log(deleteSession)
                if (deleteSession) return true;
            }
            return true;
        }
    }

    // get the token from the session 
    static async findToken(user_id: string): Promise<string | boolean> {
        const session = await Session.findOne({
            where: {
                user_id,
            }
        });

        if (session) return session.token;

        return false;
    }
}



export default Session;