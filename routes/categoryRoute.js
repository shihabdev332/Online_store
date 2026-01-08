import express from "express";
import { addCategory, getCategories } from "../controller/categoryController.js";


const categoryRouter = express.Router();
categoryRouter.post("/add", addCategory); 

categoryRouter.get("/list", getCategories);

export default categoryRouter;