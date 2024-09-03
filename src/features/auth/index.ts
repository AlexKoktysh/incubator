import { Router } from "express";
import { inputValidationMiddleware } from "./middlewares";
import { loginUser } from "./AuthControllers";

export const AuthRouters = Router();

AuthRouters.post("/login", inputValidationMiddleware, loginUser);
