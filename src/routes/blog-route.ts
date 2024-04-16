import {Router, Response, Request} from "express";
import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {blogValidation} from "../validators/blog-validators";
import {BlogRepository} from "../repositories/blog-repository";
import {RequestWithBody, RequestWithParamsAndBody} from "../types/common";
import {CreateNewBlogType, CreateNewPostType, UpdateBlogType} from "../types/blogs/input";
import { BlogOutputType} from "../types/blogs/output";
import {ObjectId} from "mongodb";
import {PostOutputType} from "../types/posts/output";
import {BlogsService} from "../domain/blogs-service";


export const blogRoute = Router({});


blogRoute.post('/', authMiddleware, blogValidation(), async (req: RequestWithBody<CreateNewBlogType>, res: Response<BlogOutputType>) => {
    const {name, description, websiteUrl}: CreateNewBlogType = req.body
    const newBlog= await BlogsService.createBlog({name, description, websiteUrl})

    res.status(201).send(newBlog)
})


// Роут для создания нового поста для конкретного блога
// TODO Добавить валидацию
blogRoute.post('/:blogId/posts', authMiddleware, async (req: RequestWithParamsAndBody<{
    blogId: string
}, CreateNewPostType>, res: Response<PostOutputType>) => {

    // Извлекаем параметры и тело запроса из запроса
    const {blogId} = req.params;
    const {title, shortDescription, content} = req.body;
    const newPost = await BlogsService.createPostToBlog({title, shortDescription, content, blogId})

    // Отправляем успешный ответ с созданным постом
    if (!newPost) return res.sendStatus(404)
    res.status(201).json(newPost);
    return

})

blogRoute.get('/', async (res: Response<BlogOutputType[]>) => {
    const blogsPromise = await BlogsService.getAll()
    res.send(blogsPromise)
})


blogRoute.put('/:id', authMiddleware, blogValidation(), async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const blogUpdateParams: UpdateBlogType = {
        name: req.body.name,
        description: req.body.description,
        websiteUrl: req.body.websiteUrl
    }
    const blogId = req.params.id

    const doesBlogExist = await BlogsService.getById(blogId);

    if (!doesBlogExist) return res.sendStatus(404);

    const isUpdated = await BlogRepository.updateBlog(blogId, blogUpdateParams)

    if (isUpdated) return res.sendStatus(204)


    return res.sendStatus(404)
})

blogRoute.delete('/:id', authMiddleware, async (req: Request, res: Response) => {

    const isDeleted = await BlogsService.deleteBlog(req.params.id)
    if (isDeleted) {
        res.sendStatus(204)
    } else {
        res.sendStatus(404)
    }

})

blogRoute.get('/:id', async (req: Request, res: Response) => {
    if (!ObjectId.isValid(req.params.id)) {
        res.sendStatus(404)
        return
    }
    const blog = await BlogsService.getById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
    } else {
        res.sendStatus(404)
    }
})