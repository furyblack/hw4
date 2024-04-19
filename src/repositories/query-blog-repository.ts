import {BlogMongoDbType, BlogOutputType} from "../types/blogs/output";
import {ObjectId, WithId} from "mongodb";
import {blogCollection, postCollection} from "../db/db";
import {BlogMapper} from "./blog-repository";
import {PostMongoDbType, PostOutputType} from "../types/posts/output";
import {PostMapper} from "./post-repository";


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




   // формирование фильтра (может быть вынесено во вспомогательный метод)
//         const byId = blogId
//           ? {blogId: new ObjectId(blogId)}
//           : {}
//         const search = query.searchNameTerm
//           ? {title: {$regex: query.searchNameTerm, $options: 'i'}}
//           : {}
//         const filter = {
//             // ...byId,
//             // _id: {$in: [new ObjectId(someStringId), ...]}
//             // ...search,
//         }
//
//         try {
//              // собственно запрос в бд (может быть вынесено во вспомогательный метод)
//             const items = await postCollection
//                 .find(filter)
//                 .sort(query.sortBy, query.sortDirection)
//                 .skip((query.pageNumber - 1) * query.pageSize)
//                 .limit(query.pageSize)
//                 .toArray() as any[] /*SomePostType[]*/
//
// // подсчёт элементов (может быть вынесено во вспомогательный метод)
// const totalCount = await postCollection.countDocuments(filter)
//
// // формирование ответа в нужном формате (может быть вынесено во вспомогательный метод)
// return {
//     pagesCount: Math.ceil(totalCount / query.pageSize),
//     page: query.pageNumber,
//     pageSize: query.pageSize,
//     totalCount,
//     items: items.map(this.mapToOutput)
// }
// } catch (e) {
//     console.log(e)
//     return {error: 'some error'}
// }
