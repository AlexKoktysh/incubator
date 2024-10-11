import { Router } from "express";
import { bearerAuthMiddleware } from "../../middleware";
import { authController } from "./auth.controller";
import { validateBodyParams } from "../../utils";
import {
    ConfirmationSchema,
    LoginUserSchema,
    RegistrationUserSchema,
    ResendingSchema,
} from "./utils";

export const authRouter = Router();

authRouter.post(
    "/login",
    validateBodyParams(LoginUserSchema),
    authController.loginUser,
);
authRouter.post("/refresh-token", authController.refreshToken);
authRouter.post("/logout", authController.logout);
authRouter.post(
    "/registration",
    validateBodyParams(RegistrationUserSchema),
    authController.registerUser,
);
authRouter.post(
    "/registration-confirmation",
    validateBodyParams(ConfirmationSchema),
    authController.confirmUser,
);
authRouter.post(
    "/registration-email-resending",
    validateBodyParams(ResendingSchema),
    authController.resendingConfirm,
);
authRouter.get("/me", bearerAuthMiddleware, authController.getUserInfo);
