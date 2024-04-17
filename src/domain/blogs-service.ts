import {PostMongoDbType, PostOutputType} from "../types/posts/output";
import {PostMapper, PostRepository} from "../repositories/post-repository";
import {CreateNewPostType} from "../types/posts/input";
import {BlogMapper, BlogRepository} from "../repositories/blog-repository";
import {blogCollection, postCollection} from "../db/db";
import {CreateNewBlogType, UpdateBlogType} from "../types/blogs/input";
import {BlogOutputType, BlogMongoDbType} from "../types/blogs/output";
import {ObjectId, WithId} from "mongodb";


export class BlogsService {

//TODO после создания пост сервиса вернуться сюда
static async createPostToBlog(data: CreateNewPostType) {
        const {title, shortDescription, content, blogId} = data
        // Создаем новый пост для конкретного блога
        const newPost: PostOutputType | null = await PostRepository.createPost({
            title,
            shortDescription,
            content,
            blogId,
        });
        return newPost
    }

    // переносим часть функционала  с blog route ( создание блога)
    static async  createBlog (data: CreateNewBlogType){
       const {name, description, websiteUrl} = data
        const newBlog: BlogOutputType = await BlogRepository.createBlog({
            name,
            description,
            websiteUrl
        })
        return newBlog
    }



    static async updateBlog(blogId: string, updateData:UpdateBlogType): Promise<boolean> {

        const updateResult = await blogCollection.updateOne({_id:new ObjectId(blogId)}, {$set:{...updateData}})
        const updatedCount = updateResult.modifiedCount
        return !!updatedCount;

    }


    static async deleteBlog(id: string): Promise<boolean> {
        try {
            const result = await blogCollection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount === 1;
        } catch (error) {
            console.error("Error deleting blog:", error);
            return false;
        }
    }

}



