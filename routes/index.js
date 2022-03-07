import { Router } from "express";
import categoriesRouter from "./categoriesRouter.js";
import customersRouter from "./customersRouter.js";
import gamesRouter from "./gamesRouter.js";
import rentalsRoute from "./rentalsRouter.js";

const router = Router()

router.use(categoriesRouter)
router.use(gamesRouter)
router.use(customersRouter)
router.use(rentalsRoute)

export default router