import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {RequestWithBody, RequestWithQuery} from "../types/common";
import {Request, Response, Router} from "express";
import {PostOutputType} from "../types/posts/output";
import {CreateNewPostType, postQuerySortData, UpdatePostType} from "../types/posts/input";
import {PostRepository} from "../repositories/post-repository";
import {postValidation} from "../validators/post-validators";
import {QueryPostRepository} from "../repositories/query-post-repository";
import {paginator} from "../types/paginator/pagination";
import {PaginationOutputType} from "../types/blogs/output";


export const postRoute = Router({})

postRoute.get('/', async (req: RequestWithQuery<postQuerySortData>, res: Response<PaginationOutputType<PostOutputType>> ) =>{
    const paginationData = paginator(req.query)
    const posts=  await QueryPostRepository.getAll(paginationData)
    res.send(posts)
})

postRoute.get('/:id', async (req:Request, res: Response)=>{
    const postId = await QueryPostRepository.getById(req.params.id)
    if(postId){
        res.status(200).send(postId)
    }else {
        res.sendStatus(404)
    }
})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreateNewPostType>, res: Response<PostOutputType>) => {
    const  {title, shortDescription, content, blogId}:CreateNewPostType = req.body
    const addResult = await PostRepository.createPost({title, shortDescription, content, blogId })
    if(!addResult){
        res.sendStatus(404)
        return
    }
    res.status(201).send(addResult)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req:Request, res: Response)=> {
    const postUpdateParams: UpdatePostType= {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content
    }
    const postId = req.params.id

    const isUpdated = await PostRepository.updatePost(postId, postUpdateParams)
    if (isUpdated) {
        return res.sendStatus(204)
    }else{
        return res.sendStatus(404)
    }

})

postRoute.delete('/:id',  authMiddleware, async  (req:Request, res:Response) => {
    const isDeleted = await PostRepository.deletePost(req.params.id)
    if (!isDeleted){
        res.sendStatus(404)
    }else{
        res.sendStatus(204)
    }
})



