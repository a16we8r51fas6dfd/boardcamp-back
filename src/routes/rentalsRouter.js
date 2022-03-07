import { Router } from "express";
import { postRental, getRentals, returnRental, deleteRental} from "../controllers/rentalsController.js";

const rentalsRoute = Router()
rentalsRoute.get('/rentals', getRentals)
rentalsRoute.post('/rentals', postRental)
rentalsRoute.post('/rentals/:id/return', returnRental)
rentalsRoute.delete('/rentals/:id', deleteRental)

export default rentalsRoute