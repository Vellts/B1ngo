import { HasMany, HasOne, BeforeCreate, BeforeUpdate, BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import User from './User';
import { DataTypes } from 'sequelize';

@Table({
    tableName: 'users.avatarprofile',
    timestamps: true
})
export class AvatarProfile extends Model {
    @Column({
        type: 'uuid',
    })
    @ForeignKey(() => User)
    user_id: string;

    @Column({
        type: DataTypes.STRING,
    })
    public_id: string;

    @Column({
        type: DataTypes.STRING,
    })
    url: string;
}

export default AvatarProfile;