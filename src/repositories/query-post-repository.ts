import {PostMongoDbType, PostOutputType} from "../types/posts/output";
import {postCollection} from "../db/db";
import {PostMapper} from "../domain/posts-service";




export class QueryBlogRepository {

    static async getAll(title: string | null | undefined): Promise<PostOutputType[]> {
        const posts = await postCollection.find({}).toArray()
        return posts.map(post => PostMapper.toDto(post))
    }


    static async getById(id: string): Promise<PostOutputType | null> {
        const post: PostMongoDbType | null = await postCollection.findOne({_id: id})
        if (!post) {
            return null
        }
        return PostMapper.toDto(post)
    }
}