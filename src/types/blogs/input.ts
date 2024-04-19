export type CreateNewBlogType= {
    "name": string,
    "description": string,
    "websiteUrl": string
}

export type UpdateBlogType= {
    "name": string,
    "description": string,
    "websiteUrl": string
}

export type CreateNewPostType = {
    "title": string,
    "shortDescription": string,
    "content": string
}

export type blogQuerySortData = {
    pageSize?: number,
    pageNumber?: number,
    sortBy?: string,
    sortDirection?: string,
    searchNameTerm?: string,
}