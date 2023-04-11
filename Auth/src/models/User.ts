import bcrypt from 'bcryptjs';
import { HasMany, HasOne, BeforeCreate, BeforeUpdate, BelongsTo, Column, Table, Model } from 'sequelize-typescript';

interface UserAttributes {
    id: string;
    username: string;
    password: string;
    email: string;
    role: string;
    isActive?: boolean;
    accountActivated?: boolean;
    profile?: {
        url: string;
        id: string;
    };
}

@Table({
    tableName: 'users',
    timestamps: true
})
class User extends Model {
    @Column({
        type: 'uuid',
        primaryKey: true,
    })
    id: string;

    @Column({
        allowNull: false,
        unique: true,
    })
    username: string;

    @Column({
        allowNull: false,
    })
    password: string;

    @Column({
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    })
    email: string;

    @Column({
        defaultValue: 'user',
    })
    role: string;
    
    @Column({
        defaultValue: false,
    })
    isActive: string;

    @Column({
        defaultValue: false,
    })
    accountActivated: string;

    @Column({
        type: 'json',
        defaultValue: {
            id: '123',
            url: 'https://cdn.discordapp.com/attachments/816326616501452832/1007074070514380840/unknown.png'
        }
    })
    profile: string;

    @BeforeCreate({})
    @BeforeUpdate({})
    static async hasPassword(user: any): Promise<void> {
        if(user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        return;
    }

    static async comparePassword(password: string, userPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, userPassword);
    }
}



export default User;
