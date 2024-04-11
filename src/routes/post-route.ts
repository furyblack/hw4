import {authMiddleware} from "../middlewares/auth/auth-middleware";
import {RequestWithBody} from "../types/common";
import {Request, Response, Router} from "express";
import {PostOutputType} from "../types/posts/output";
import {CreateNewPostType, UpdatePostType} from "../types/posts/input";

import {PostRepository} from "../repositories/post-repository";
import {postValidation} from "../validators/post-validators";


export const postRoute = Router({})

postRoute.post('/', authMiddleware, postValidation(), async (req: RequestWithBody<CreateNewPostType>, res: Response<PostOutputType>) => {
    const  {title, shortDescription, content, blogId}:CreateNewPostType = req.body
    const addResult = await PostRepository.createPost({title, shortDescription, content, blogId })
    if(!addResult){
        res.sendStatus(404)
        return
    }
    res.status(201).send(addResult)
})
postRoute.get('/', async (req: Request, res: Response<PostOutputType[]> ) =>{
    const posts=  await PostRepository.getAll(req.query.title?.toString())
    res.send(posts)
})

postRoute.put('/:id', authMiddleware, postValidation(), async (req:Request, res: Response)=> {
    const postUpdateParams: UpdatePostType= {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content
    }
    const postId = req.params.id


    const isUpdated = await PostRepository.updatePost(postId, postUpdateParams)
    console.log(isUpdated)
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

postRoute.get('/:id', async (req:Request, res: Response)=>{
    const postId = await PostRepository.getById(req.params.id)
    if(postId){
        res.status(200).send(postId)
    }else {
        res.sendStatus(404)
    }
})

