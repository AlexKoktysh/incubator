import { Request, Response } from "express";
import { database } from "../db/database";
import { HttpStatuses } from "../utils";

export const clearDb = async (_req: Request, res: Response) => {
    await database.drop();

    res.status(HttpStatuses.NoContent).json("All data is deleted");
};
