import rateLimit from "express-rate-limit";
import { HttpStatuses } from "../utils";

export const limiterMiddleware = rateLimit({
    windowMs: 100 * 1000,
    max: 5,
    handler: (_req, res, _next) => {
        res.status(HttpStatuses.Limited).send(
            "Too many requests, please try again later.",
        );
    },
    keyGenerator: (req) => `${req.ip}:${req.url}`,
    // skipSuccessfulRequests: true,
});
