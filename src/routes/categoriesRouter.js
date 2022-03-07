import { Router } from "express";
import { getCategories, postCategories } from "../controllers/categoriesController.js";
import { validateCategorySchema } from "../middlewares/validateCategorySchema.js";

const categoriesRouter = Router()
categoriesRouter.get('/categories', getCategories)
categoriesRouter.post('/categories', validateCategorySchema, postCategories)
export default categoriesRouter