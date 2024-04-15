import {PostOutputType} from "../types/posts/output";
import {PostRepository} from "../repositories/post-repository";
import {CreateNewPostType} from "../types/posts/input";

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
}

