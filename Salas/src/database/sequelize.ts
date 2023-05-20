import { Sequelize, type SequelizeOptions } from 'sequelize-typescript';
import { join } from 'path';


const sql_options: SequelizeOptions = {
    //
    dialect: 'postgres',
    host: process.env.SQL_HOST,
    port: Number(process.env.SQL_PORT),
    models: [`${join(__dirname, '../models')}/*.ts`],
    logging: false,
}

const root = process.env

console.log(root.POSTGRES_PASSWORD)

export const sequelize = new Sequelize(`postgres://${root.POSTGRES_USER}:${root.POSTGRES_PASSWORD}@${root.SQL_HOST}:${root.SQL_PORT}/${root.POSTGRES_DB}`,
    {...sql_options}
)