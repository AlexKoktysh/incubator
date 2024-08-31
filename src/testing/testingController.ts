import { Request, Response } from "express";
import { setDB } from "../db/db";
import { blogCollection } from "../db/mongo-db";

export const clearDb = async (req: Request, res: Response) => {
    await blogCollection.deleteMany();
    setDB();

    res.status(204).json("All data is deleted");
};
