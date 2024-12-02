import { Response, Request } from "express";
import { cookieService, jwtService } from "../../services";
import { HttpStatuses, OutputErrorsType } from "../../utils";
import { devicesQueryRepository, devicesRepository } from "./repositories";
import { DevicesViewType } from "./types";
import { constantsConfig } from "../../config";

export const devicesController = {
    async create({
        userId,
        token,
        deviceName,
        IP,
    }: {
        userId: string;
        token: string;
        deviceName: string;
        IP: string;
    }): Promise<string | null> {
        const userByToken = jwtService.getUserByToken(token, "refresh");

        if (!userByToken) return null;

        const newDevice = {
            issuedAt: new Date(userByToken.iat * 1000).toISOString(),
            deviceId: userByToken.deviceId,
            deviceName,
            IP,
            userId,
        };
        return await devicesRepository.create(newDevice);
    },
    async update({ deviceId, iat }: { deviceId: string; iat: number }) {
        return await devicesRepository.update({
            deviceId,
            iat,
        });
    },
    async getAll(
        req: Request,
        res: Response<DevicesViewType[] | OutputErrorsType>,
    ) {
        try {
            const devices = await devicesQueryRepository.getAll(
                req.userId as string,
            );
            res.status(HttpStatuses.Success).json(devices);
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async deleteAll(req: Request, res: Response) {
        try {
            const token = cookieService.getCookie(
                constantsConfig.refreshTokenCookieName,
                req,
            );
            const userMeta = jwtService.getUserByToken(token, "refresh");

            await devicesRepository.deleteAll(
                req.userId as string,
                userMeta?.deviceId as string,
            );
            res.status(HttpStatuses.NoContent).json("Ok");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
    async deleteById(req: Request<{ id: string }>, res: Response) {
        try {
            const device = await devicesQueryRepository.find(req.params.id);

            if (device?.userId !== req.userId) {
                res.status(HttpStatuses.Forbidden).json("No permission");
                return;
            }

            await devicesRepository.deleteById(req.params.id);
            res.status(HttpStatuses.NoContent).json("Ok");
        } catch (err: any) {
            res.status(HttpStatuses.Error).json(err);
        }
    },
};
