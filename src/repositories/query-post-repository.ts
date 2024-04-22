import {PostMongoDbType, PostOutputType, postSortData} from "../types/posts/output";
import { postCollection} from "../db/db";
import {PostMapper} from "../domain/posts-service";
import {PaginationOutputType} from "../types/blogs/output";
import {SortDirection} from "mongodb";



export class QueryPostRepository {

    static async getAll(sortData: postSortData):Promise<PaginationOutputType<PostOutputType>> {
        const {pageSize, pageNumber, sortBy, sortDirection, searchNameTerm} = sortData
        const search = searchNameTerm
            ? {title: {$regex: searchNameTerm, $options: 'i'}}
            : {}
        const  post = await postCollection
            .find(search)
            .sort(sortBy, sortDirection as SortDirection)
            .limit(pageSize)
            .skip((pageNumber - 1) * pageSize)
            .toArray()

        const totalCount = await postCollection.countDocuments(search)
        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: post.map(p =>PostMapper.toDto(p))
        }

    }


    static async getById(id: string): Promise<PostOutputType | null> {
        const post: PostMongoDbType | null = await postCollection.findOne({_id: id})
        if (!post) {
            return null
        }
        return PostMapper.toDto(post)
    }
}