import {PostMongoDbType, PostOutputType} from "../types/posts/output";
import {PostMapper, PostRepository} from "../repositories/post-repository";
import {CreateNewPostType} from "../types/posts/input";
import {BlogRepository} from "../repositories/blog-repository";
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
        return posts.map((post)=> PostMapper.toDto(post))
    }


    static async getAll():Promise<BlogOutputType[]> {
        const  blog = await blogCollection.find({}).toArray()
        return blog.map(b=>BlogMapper.toDto(b))

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


// копия кода из blog repository ( рефакторим)


export class BlogMapper {
    static toDto(blog: WithId<BlogMongoDbType>):BlogOutputType{
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            isMembership: false,
            createdAt: blog.createdAt.toISOString()
        }
    }
}
