import { ObjectId } from "mongodb";

export type UserDBType = {
    _id: ObjectId;
    login: string;
    email: string;
    createdAt: string;
    password: string;
    emailConfirmation: {
        confirmationCode: string;
        expirationDate: Date;
        isConfirmed: boolean;
    };
    refreshToken: string;
};
