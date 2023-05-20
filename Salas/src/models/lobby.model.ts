import { HasMany, HasOne, BeforeCreate, BeforeUpdate, BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import User from './user.model';
import { DataTypes } from 'sequelize';
import { randomLobbyName } from '../helpers/asyncHandler';
import bcrypt from 'bcryptjs';

interface LobbyAttributes {
    id: string;
    lobby_name: string;
    lobby_owner: User;
    lobby_password?: string;
}

@Table({
    tableName: 'lobbies',
    timestamps: true,
})
class Lobby extends Model {
    
    @Column({
        type: DataTypes.STRING,
    })
    lobby_id: string;

    @Column({
        type: DataTypes.STRING,
        defaultValue: `Lobby ${randomLobbyName()}`,
    })
    lobby_name: string;

    @Column({
        type: DataTypes.STRING,
        defaultValue: '',
    })
    lobby_password: string;

    @Column({
        type: DataTypes.UUID,
    })
    @ForeignKey(() => User)
    lobby_owner: string;

    @BelongsTo(() => User)
    user: User;

    @BeforeCreate({})
    @BeforeUpdate({})
    static async hashPassword(instance: Lobby) {
        // return instance.lobby_password = await bcrypt.genSalt(10).then(salt => bcrypt.hash(instance.lobby_password, salt));
        if (instance.lobby_password) {
            return instance.lobby_password = await bcrypt.genSalt(10).then(salt => bcrypt.hash(instance.lobby_password, salt));
        }

        return instance.lobby_password;
    }

    static async comparePassword(password: string, hash: string) {
        return await bcrypt.compare(password, hash);
    }

    static async findLobby(lobby_name: string) {
        return await Lobby.findOne({ where: { lobby_name } });
    }

    static async findLobbyById(lobby_id: string) {
        return await Lobby.findOne({ where: { lobby_id } });
    }
    
}

export default Lobby;