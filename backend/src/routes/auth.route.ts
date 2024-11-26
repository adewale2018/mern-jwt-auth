import {
  loginHandler,
  logoutHandler,
  registerHandler,
} from "../controllers/auth.controller";

import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/logout", logoutHandler);

export default authRoutes;
