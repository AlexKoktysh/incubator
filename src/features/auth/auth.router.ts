import { Router } from "express";
import { bearerAuthMiddleware, limiterMiddleware } from "../../middleware";
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
    limiterMiddleware,
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
    limiterMiddleware,
    validateBodyParams(RegistrationUserSchema),
    authController.registerUser,
);
authRouter.post(
    "/registration-confirmation",
    limiterMiddleware,
    validateBodyParams(ConfirmationSchema),
    authController.confirmUser,
);
authRouter.post(
    "/registration-email-resending",
    limiterMiddleware,
    validateBodyParams(ResendingSchema),
    authController.resendingConfirm,
);
authRouter.get("/me", bearerAuthMiddleware, authController.getUserInfo);
