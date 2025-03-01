import { asyncHandler } from "../utils/asyncHandler";
import { generateRecipeSchema } from "../lib/schemas";
import { generateRecipe } from "../services/recipe.service";
import { CREATED, OK } from "../config/http.config";
import RecipeModel from "../models/recipe.model";
import { BUCKET_NAME } from "../config/env.config";
import { s3 } from "../config/s3.config";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const handleGenerateRecipe = asyncHandler(async (req, res) => {
  const data = generateRecipeSchema.parse({ ...req.body, userId: req.userId });

  const { recipe } = await generateRecipe(data);

  return res.status(CREATED).json(recipe);
});

export const handleGetRecipes = asyncHandler(async (req, res) => {
  const recipes = await RecipeModel.find({ userId: req.userId });

  return res.status(OK).json(recipes);
});

export const handleGetRecipe = asyncHandler(async (req, res) => {
  const recipe = await RecipeModel.find({
    userId: req.userId,
    _id: req.params.id,
  });

  return res.status(OK).json(recipe);
});

export const handleDeleteRecipe = asyncHandler(async (req, res) => {
  const recipe = await RecipeModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  const fileName = recipe?.pdfUrl?.split("/").pop();

  const params = {
    Bucket: BUCKET_NAME,
    Key: `recipes/${fileName}`,
  };

  s3.send(new DeleteObjectCommand(params));

  return res.status(OK).json({
    message: "Recipe deleted",
  });
});
