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

export const sequelize = new Sequelize(`postgres://${root.SQL_USER}:${root.SQL_PASS}@${root.SQL_HOST}:${root.SQL_PORT}/${root.SQL_DATABASE}`,
    {...sql_options}
)