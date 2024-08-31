import { Request, Response } from "express";
import { blogCollection, postCollection } from "../db/mongo-db";

export const clearDb = async (req: Request, res: Response) => {
    await blogCollection.deleteMany();
    await postCollection.deleteMany();;

    res.status(204).json("All data is deleted");
};
