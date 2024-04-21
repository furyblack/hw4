import {BlogMongoDbType, BlogOutputType, blogSortData, PaginationOutputType} from "../types/blogs/output";
import {ObjectId, SortDirection, WithId} from "mongodb";
import {blogCollection, postCollection} from "../db/db";
import {BlogMapper} from "./blog-repository";
import {PostMongoDbType, PostOutputType} from "../types/posts/output";
import {PostMapper} from "./post-repository";
import request from "supertest";


export class QueryBlogRepository {

    static async getById(id: string): Promise<BlogOutputType | null> {
        const blog: WithId<BlogMongoDbType> | null = await blogCollection.findOne({_id: new ObjectId(id)})
        if (!blog) {
            return null
        }
        return BlogMapper.toDto(blog)
    }

// get by ID для конкретного поста
    static async getAllPostsForBlog(blogId: string): Promise<PostOutputType[] | null> {
        const posts: WithId<PostMongoDbType>[] | null = await postCollection.find({blogId: blogId}).toArray()
        if (!posts) {
            return null
        }


        return posts.map((post) => PostMapper.toDto(post))
    }


    static async getAll(sortData: blogSortData): Promise<PaginationOutputType<BlogOutputType>> {
        const {pageSize, pageNumber, sortBy, sortDirection, searchNameTerm} = sortData
        const search = searchNameTerm
            ? {name: {$regex: searchNameTerm, $options: 'i'}}
            : {}
        const blog = await blogCollection
            .find(search)
            .sort(sortBy, sortDirection as SortDirection) //был вариант(sortBy as keyof BlogOutputType, sortDirection as SortDirection))
            .limit(pageSize)
            .skip((pageNumber - 1) * pageSize)
            .toArray()


        // подсчёт элементов (может быть вынесено во вспомогательный метод)
        const totalCount = await blogCollection.countDocuments(search)

        return {

            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount,
            items: blog.map(b => BlogMapper.toDto(b))
        }

    }
}


