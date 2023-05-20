import bcrypt from 'bcryptjs';
import { HasMany, HasOne, BeforeCreate, BeforeUpdate, BelongsTo, Column, Table, Model, ForeignKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { LoginUser } from '../interfaces/user.interface';
import AvatarProfile from './avatarUser';
import Session from './session';
import { EmailVerificator } from './EmailVerification';

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
    
    // add AvatarProfile as a foreign key
    // @ForeignKey(() => AvatarProfile)
    @HasOne(() => AvatarProfile)
    profile?: AvatarProfile;

    @HasOne(() => Session)
    session?: Session;

    @HasOne(() => EmailVerificator)
    emailVerification?: EmailVerificator;


    @BeforeCreate({})
    @BeforeUpdate({})
    static async hashPassword(user: any): Promise<void> {
        if(user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }

        return;
    }

    static async comparePassword(password: string, userPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, userPassword);
    }

    static async getUserByEmail(email: string): Promise<User | null> {
        return await User.findOne({ where: { email } });
    }

    static async getUserById(id: string): Promise<User | null> {
        return await User.findOne({ where: { user_id: id } });
    }

    static async registerNewUser(user: UserAttributes | any): Promise<User | null> {
        return await User.create(user);
    }
    static async emailExists(email: string): Promise<boolean> {
        const existingUser = await User.findOne({ where: { email } });
        return !!existingUser; 
    }
    static async userExists(user: string): Promise<boolean> {
        const existingUser = await User.findOne({ where: { user } });
        return !!existingUser; 
    }
    
}



export default User;
