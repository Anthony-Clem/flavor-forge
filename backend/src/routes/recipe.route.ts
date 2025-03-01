import { Router } from "express";
import {
  handleDeleteRecipe,
  handleGenerateRecipe,
  handleGetRecipe,
  handleGetRecipes,
} from "../controllers/recipe.controller";

const recipeRoute = Router();

recipeRoute.post("/generate", handleGenerateRecipe);
recipeRoute.get("/", handleGetRecipes);
recipeRoute.get("/:id", handleGetRecipe);
recipeRoute.delete("/:id", handleDeleteRecipe);

export default recipeRoute;
