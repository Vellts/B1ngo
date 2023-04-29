import { HasMany, HasOne, BeforeCreate, BeforeUpdate, BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import User from './User';
import { DataTypes } from 'sequelize';
import jwt from 'jsonwebtoken';

@Table({
    tableName: 'users.verifyemail',
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
    code: string;

    @Column({
        type: DataTypes.DATE,
    })
    date: Date;
}

export default Session;