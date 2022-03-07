import { Router } from "express";
import { getGames, postGame } from "../controllers/gamesController.js";
import validateGameSchema from "../middlewares/validateGameSchema.js";

const gamesRouter = Router()
gamesRouter.get('/games', getGames)
gamesRouter.post('/games', validateGameSchema, postGame)
export default gamesRouter