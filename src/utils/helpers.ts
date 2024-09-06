import { QueryPaginationType } from "./types";

export const getPaginationOptionsForResponse = (
    query: QueryPaginationType,
    totalCount: number,
) => {
    const perPage = query.pageSize ? Number(query.pageSize) : 10;
    const pagesCount = Math.ceil(totalCount / perPage);
    const page = query.pageNumber ? Number(query.pageNumber) : 1;
    const pageSize = query.pageSize ? Number(query.pageSize) : 10;
    return { pagesCount, page, pageSize };
};

export const setDefaultQueryParams = (query: QueryPaginationType) => {
    const defaultQuery = {
        pageNumber: query.pageNumber ?? "1",
        pageSize: query.pageSize ?? "10",
        sortBy: query.sortBy ?? "createdAt",
        sortDirection: query.sortDirection ?? "desc",
    };
    return defaultQuery;
};
