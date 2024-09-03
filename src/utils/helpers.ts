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
