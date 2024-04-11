export type BlogOutputType =  {
    "id": string,
    "name": string,
    "description": string,
    "websiteUrl": string,
    "isMembership": boolean,
    "createdAt": string
}
export type BlogMongoDbType =  {
    //"_id": string,
    "name": string,
    "description": string,
    "websiteUrl": string,
    "createdAt": Date
}