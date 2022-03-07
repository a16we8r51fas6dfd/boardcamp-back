import { Router } from "express";
import { getCustomerById, getCustomers, postCustomer, updateCustomer } from "../controllers/customersController.js";
import validateCustomerSchema from "../middlewares/validateCustomerSchema.js";

const customersRouter = Router()
customersRouter.get('/customers', getCustomers)
customersRouter.get('/customers/:id', getCustomerById)
customersRouter.post('/customers', validateCustomerSchema, postCustomer)
customersRouter.put('/customers/:id', validateCustomerSchema, updateCustomer)
export default customersRouter