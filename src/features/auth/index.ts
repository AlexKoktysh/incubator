import { Router } from "express";
import { inputValidationMiddleware } from "./middlewares";
import { getUserInfo, loginUser } from "./AuthControllers";
import { bearerAuthMiddleware } from "../../middleware";

export const AuthRouters = Router();

AuthRouters.post("/login", inputValidationMiddleware, loginUser);
AuthRouters.get("/me", bearerAuthMiddleware, getUserInfo);
