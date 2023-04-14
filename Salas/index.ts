import App from "./src/app"
import "dotenv/config"
import { sequelize } from "./src/database/sequelize"
import routes from "./src/routes/auth.route";

const port: number = Number(process.env.PORT) || 3000;


sequelize.authenticate()
.then(() => {
    sequelize.sync({ force: true }).then(() => {
        console.log("Database synced")
        
        const server = new App({port: port, controllers: [routes]})
        server.run()
    })

})
.catch((err) => {
    console.log("Error syncing database");
    console.log(err)
}) 