import { HasMany, HasOne, BeforeCreate, BeforeUpdate, BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import Lobby from './lobby.model';

interface UserAttributes {
    id: string;
    username: string;
    password: string;
    email: string;
    role: string; // [user, admin]
    isActive?: boolean;
    accountActivated?: boolean;
    profile?: {
        url: string;
        id: string;
    };
}

@Table({
    tableName: 'users',
    timestamps: true,
    
})
class User extends Model {

    @Column({
        type: 'uuid',
        primaryKey: true,
    })
    user_id: string;

    @Column({
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
    })
    username: string;

    @Column({
        allowNull: false,
        type: DataTypes.STRING,
    })
    password: string;

    @Column({
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
        type: DataTypes.STRING,
    })
    email: string;

    @Column({
        defaultValue: 'user',
        type: DataTypes.STRING,
    })
    role: string;
    
    @Column({
        defaultValue: true,
        type: 'boolean',
    })
    isActive?: boolean;

    @Column({
        defaultValue: true,
        type: 'boolean',
    })
    accountActivated?: boolean;

    @HasOne(() => Lobby)
    lobby_owner: Lobby;

    
}



export default User;
