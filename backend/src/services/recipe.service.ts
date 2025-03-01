import { GEMINI_API_KEY } from "../config/env.config";
import { GenerateRecipeParams } from "../lib/types";
import RecipeModel from "../models/recipe.model";
import { generateRecipePdf } from "../utils/generateRecipePdf";

export const generateRecipe = async ({
  userId,
  dishName,
  servingSize,
}: GenerateRecipeParams) => {
  const requestData = {
    contents: [
      {
        parts: [
          {
            text: `Generate a detailed cooking recipe in **pure JSON format** based on the following input:
            - Dish Name: ${dishName}
            - Servings: ${servingSize}
            
            JSON structure:
            {
              "title": "Dish Name",
              "description": "Brief description of the dish.",
              "ingredients": [
                { "name": "Ingredient 1", "quantity": "Amount and unit" },
                { "name": "Ingredient 2", "quantity": "Amount and unit" }
              ],
              "steps": [
                "Step 1",
                "Step 2",
                "Step 3"
              ],
              "prepTime": "XX minutes",
              "cookTime": "XX minutes",
              "totalTime": "XX minutes",
              "tags": ["tag1", "tag2", "tag3"]
            }
            
            Respond ONLY in **raw JSON format** with no extra text, explanations, or Markdown formatting.`,
          },
        ],
      },
    ],
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  let recipeText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  recipeText = recipeText.replace(/```json|```/g, "").trim();

  const recipeJSON = JSON.parse(recipeText);

  const recipe = await RecipeModel.create({
    userId,
    title: recipeJSON.title,
    servingSize,
    description: recipeJSON.description,
    ingredients: recipeJSON.ingredients,
    steps: recipeJSON.steps,
    prepTime: recipeJSON.prepTime,
    cookTime: recipeJSON.cookTime,
    totalTime: recipeJSON.totalTime,
    tags: recipeJSON.tags,
  });

  const pdfUrl = await generateRecipePdf(recipe);

  recipe.pdfUrl = pdfUrl;

  recipe.save();

  return {
    recipe,
  };
};

export const getRecipes = async (userId: string) => {
  const recipes = await RecipeModel.find({
    userId,
  });

  return {
    recipes,
  };
};
