import { Request, Response } from "express";
import { database } from "../db/database";

export const clearDb = async (_req: Request, res: Response) => {
    await database.drop();

    res.status(204).json("All data is deleted");
};
