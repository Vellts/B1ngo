import express, { Application } from 'express';

class App {
    public app: Application;
    private port: number;

    constructor(appInit: { port: number; middlewares?: any; controllers?: any; }) {
        this.app = express();
        this.port = appInit.port;

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }))

        this.middlewares(appInit.middlewares);
        this.routes(appInit.controllers);
    }

    private middlewares(middlewares: { forEach: (arg0: (middleware: any) => void) => void; }) {
        middlewares.forEach(middleware => {
            this.app.use(middleware);
        });
    }

    private routes(controllers: { forEach: (arg0: (controller: any) => void) => void; }) {

        controllers.forEach(controller => {
            this.app.use('/api/v1', controller);
        });
    }

    public run() {
        this.app.listen(this.port, '0.0.0.0', () => {
            console.log(`Aplicación en localhost:${this.port}`);
        });
    }
}

export default App;