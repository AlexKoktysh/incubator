export type OutputErrorsType = {
    errorsMessages: {
        message: string;
        field: string;
    }[];
};

export type PaginationType = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
};

export type QueryPaginationType = {
    sortBy?: string;
    sortDirection?: "asc" | "desc";
    pageNumber?: string;
    pageSize?: string;
};

export type FindEntityFunction<T> = (id: string) => Promise<T | null>;

export enum HttpStatuses {
    Success = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    Limited = 429,
    Error = 500,
}

declare global {
    namespace Express {
        export interface Request {
            userId: string | null;
        }
    }
}

export type NodemailerDto = {
    email: string;
    subject: string;
    message: string;
};

export enum MailerTypeEnum {
    REGISTRATION = "REGISTRATION",
    RESENDING_CONFIRM = "RESENDING_CONFIRM",
}

export type CreateMailerDto = {
    type: MailerTypeEnum;
    code: string;
};
