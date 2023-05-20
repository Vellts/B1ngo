import express, { Application } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { options } from './helpers/swagger';

class App {
    public app: Application;
    private port: number;

    /**
     * 
     * @param appInit port: number, middlewares: any, controllers: any
     * @description Inicializa la aplicación
     */
    constructor(appInit: { port: number; middlewares?: any; controllers?: any; }) {
        this.app = express();
        this.port = appInit.port;

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }))

        this.middlewares(appInit.middlewares);
        this.routes(appInit.controllers);
    }

    /**
     * 
     * @param middlewares middlewares: Array 
     * @description Agrega los middlewares a la aplicación
     * @returns void
     */
    private middlewares(middlewares: { forEach: (arg0: (middleware: any) => void) => void; }) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }

    /**
     * 
     * @param controllers controllers: Array
     * @description Agrega los controladores a la aplicación
     * @returns void
     */
    private routes(router: { forEach: (arg0: (route: any) => void) => void; }) {

        router.forEach(route => {
            // console.log(`Route ${route}`)
            this.app.use('/api/v1', route);
        });

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options), { explorer: true }));
    }

    /**
     * @description Inicia la aplicación
     * @returns void
     */
    public run() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Aplicación en localhost:${this.port}`);
        }); 
    }
}

export default App;