import {BlogMongoDbType, BlogOutputType} from "../types/blogs/output";
import {ObjectId, WithId} from "mongodb";
import {blogCollection, postCollection} from "../db/db";
import {BlogMapper} from "./blog-repository";
import {PostMongoDbType, PostOutputType} from "../types/posts/output";
import {PostMapper} from "./post-repository";
import {body, validationResult, query, param} from 'express-validator'

export class QueryBlogRepository{



static async getById(id: string):Promise<BlogOutputType | null> {
    const blog: WithId<BlogMongoDbType> | null = await blogCollection.findOne({_id: new ObjectId(id)})
if (!blog){
    return null
}
return BlogMapper.toDto(blog)
}

// get by ID для конкретного поста
static async getByIdPostForBlog(blogId: string):Promise<PostOutputType[] | null> {
    const posts: WithId<PostMongoDbType>[] | null = await postCollection.find({blogId: blogId}).toArray()
if (!posts){
    return null
}
return posts.map((post) => PostMapper.toDto(post))
}

static async getAll():Promise<BlogOutputType[]> {
    const  blog = await blogCollection.find({}).toArray()
    return blog.map(b=>BlogMapper.toDto(b))

    }
}