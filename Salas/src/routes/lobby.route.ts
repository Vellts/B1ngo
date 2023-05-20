import { Router } from "express";
import { check_refresh_token, check_token } from "../middlewares/token.middleware";
import { get_token } from "../controllers/token.controller";
import { createLobbyController } from "../controllers/lobby.controller";
import { lobbyChecker } from "../middlewares/lobby.middleware";

const routes = Router();


routes.get('/get_token', check_refresh_token, get_token)
routes.post('/lobby', check_token, lobbyChecker, createLobbyController)

export default routes;