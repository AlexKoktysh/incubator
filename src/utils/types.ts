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
