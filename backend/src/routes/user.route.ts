import { Router } from "express";
import {
  getUserHandler,
  updateUserHandler,
} from "../controllers/user.controller";

const userRoute = Router();

userRoute.get("/", getUserHandler);
userRoute.put("/", updateUserHandler);

export default userRoute;
