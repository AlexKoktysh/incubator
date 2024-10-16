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
import {
    checkCredentialsMiddleware,
    checkRefreshTokenMiddleware,
} from "./middlewares";

export const authRouter = Router();

authRouter.post(
    "/login",
    validateBodyParams(LoginUserSchema),
    checkCredentialsMiddleware,
    authController.loginUser,
);
authRouter.post(
    "/refresh-token",
    checkRefreshTokenMiddleware,
    authController.refreshToken,
);
authRouter.post("/logout", checkRefreshTokenMiddleware, authController.logout);
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
