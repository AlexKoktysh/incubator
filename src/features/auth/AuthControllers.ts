import { Response, Request } from "express";
import { LoginUserDto } from "./types";
import { AuthMongoRepository } from "./AuthMongoRepository";
import { comparePassword } from "../../services/hashPasswordService";
import { generateJwtTokens, getUserByToken } from "../../services/jwtService";

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
        const { accessToken } = generateJwtTokens(user);
        res.status(200).json({ accessToken: accessToken });
    } catch (err: any) {
        res.status(500).json(err);
    }
};

export const getUserInfo = async (req: Request, res: Response) => {
    try {
        const user = await AuthMongoRepository.find(req.userId as string);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
};
