import { loginHandler, registerHandler } from "../controllers/auth.controller";

import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);

export default authRoutes;
