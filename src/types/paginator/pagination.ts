import {blogQuerySortData} from "../blogs/input";
import {blogSortData} from "../blogs/output";

export function paginator(query: blogQuerySortData):blogSortData {
    const pageSize = query.pageSize ? +query.pageSize : 10
    const pageNumber = query.pageNumber ? +query.pageNumber: 1
    const sortBy = query.sortBy ? query.sortBy as string: 'createdAt'
    const sortDirection = query.sortDirection ? query.sortDirection  : 'desc'
    const searchNameTerm = query.searchNameTerm ? query.searchNameTerm as string: null
    return  {
        pageSize,pageNumber,sortBy,sortDirection, searchNameTerm
    }
}