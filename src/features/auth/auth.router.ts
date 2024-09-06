import { Router } from "express";
import { bearerAuthMiddleware } from "../../middleware";
import { authController } from "./auth.controller";
import { validateBodyParams } from "../../utils";
import { LoginUserSchema } from "./utils";

export const authRouter = Router();

authRouter.post(
    "/login",
    validateBodyParams(LoginUserSchema),
    authController.loginUser,
);
authRouter.get("/me", bearerAuthMiddleware, authController.getUserInfo);
