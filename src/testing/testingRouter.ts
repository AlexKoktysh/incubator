import { Router } from "express";
import { clearDb } from "./testingController";

export const TestingsRouter = Router();

TestingsRouter.delete("/all-data", clearDb);
