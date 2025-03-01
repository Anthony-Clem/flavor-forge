import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { APP_ORIGIN, BASE_URL, NODE_ENV, PORT } from "./config/env.config";
import { connectDB } from "./config/db.config";
import { OK } from "./config/http.config";
import { errorHandler } from "./middleware/errorHandler.middleware";
import authRoutes from "./routes/auth.route";
import userRoute from "./routes/user.route";
import { authenticate } from "./middleware/authenticate.middleware";
import recipeRoute from "./routes/recipe.route";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

app.get(`${BASE_URL}/health`, (req, res) => {
  res.status(OK).json({
    status: "healthy",
  });
});

app.use(`${BASE_URL}/auth`, authRoutes);
app.use(`${BASE_URL}/user`, authenticate, userRoute);
app.use(`${BASE_URL}/recipes`, authenticate, recipeRoute);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT} in ${NODE_ENV} environment`);
  connectDB();
});
