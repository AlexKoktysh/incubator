import { Request, Response } from "express";
import { setDB } from "../db/db";

export const clearDb = async (req: Request, res: Response) => {
    setDB();

    res.status(204).json("OK");
};
