import App from "./src/app"
import "dotenv/config"
import { sequelize } from "./src/database/sequelize"
import authRoute from "./src/routes/auth.route";
import morgan from "morgan"

const port: number = Number(process.env.PORT) || 3000;
const morganMode: string = process.env.MORGAN_MODE || "dev"


sequelize.authenticate()
.then(() => {
    sequelize.sync().then(() => {
        console.log("Database synced")
        
        const server = new App({port: port, controllers: [authRoute], middlewares: [morgan(morganMode)]})
        server.run()
    })

})
.catch((err) => {
    console.log("Error syncing database");
    console.log(err)
}) 