import App from "./src/app"
import "dotenv/config"
import { sequelize } from "./src/database/sequelize"
import authRoute from "./src/routes/auth.route";
import morgan from "morgan"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"

const port: number = Number(process.env.PORT) || 3000;
const morganMode: string = process.env.NODE_ENV || "dev"


sequelize.authenticate()
.then(() => {
    sequelize.sync().then(() => {
        console.log("Auth | Database synced")
        
        const server = new App({port: port, controllers: [authRoute], middlewares: [
            morgan(morganMode), 
            cookieParser(),
            helmet(),
            cors({
                origin: "http://localhost:3001",
                credentials: true,
                exposedHeaders: ["set-cookie", "authorization", "refresh_token"],
            })
        ]})
        server.run()
    })

})
.catch((err) => {
    console.log("Error syncing database");
    console.log(err)
}) 