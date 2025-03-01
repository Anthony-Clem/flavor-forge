import { Router } from "express";
import {
  checkAuthHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  registerHandler,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/authenticate.middleware";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/check-auth", authenticate, checkAuthHandler);

export default authRoutes;
