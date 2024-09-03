import { Response, Request } from "express";
import { LoginUserDto } from "./types";
import { AuthMongoRepository } from "./AuthMongoRepository";
import { comparePassword } from "../../services/hashPasswordService";

export const loginUser = async (
    req: Request<any, any, LoginUserDto>,
    res: Response,
) => {
    try {
        const { loginOrEmail, password } = req.body;
        const user = await AuthMongoRepository.find(loginOrEmail);
        if (!user?.id) {
            res.status(401).send({ error: "Wrong email or password." });
            return;
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            res.status(401).send({ error: "Wrong email or password." });
            return;
        }
        res.status(204).json("OK");
    } catch (err: any) {
        res.status(500).json(err);
    }
};
