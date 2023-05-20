import App from "./src/app"
import "dotenv/config"
import { sequelize } from "./src/database/sequelize"
import routes from "./src/routes/lobby.route";
import morgan from "morgan"
import cors from "cors"
import cookieParser from "cookie-parser"

const port: number = Number(process.env.PORT) || 4000;


sequelize.authenticate()
.then(() => {
        sequelize.sync({ force: false }).then(() => {
        console.log("Lobbys | Database synced")
        
        const server = new App({port: port, controllers: [routes], middlewares: [
            morgan('dev'),
            cookieParser(),
            cors({
                origin: "http://localhost:3000",
                credentials: true,
                exposedHeaders: ["set-cookie"]
            })
        ]})
        server.run()
    })
})
.catch((err) => {
    console.log("Error syncing database");
    console.log(err)
}) 