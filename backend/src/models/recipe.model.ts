import mongoose from "mongoose";
import { IngredientType } from "../lib/types";

export interface RecipeDocument extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  servingSize: number;
  ingredients: IngredientType[];
  steps: string[];
  prepTime: string;
  cookTime: string;
  totalTime: string;
  tags: string[];
  pdfUrl: string | null;
}

const recipeSchema = new mongoose.Schema<RecipeDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    servingSize: {
      type: Number,
      required: true,
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: String,
          required: true,
        },
      },
    ],
    steps: [{ type: String, required: true }],
    prepTime: {
      type: String,
      required: true,
    },
    cookTime: {
      type: String,
      required: true,
    },
    totalTime: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    pdfUrl: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

const RecipeModel = mongoose.model<RecipeDocument>("Recipe", recipeSchema);
export default RecipeModel;
