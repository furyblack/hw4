import {BlogMongoDbType, BlogOutputType, blogSortData} from "../types/blogs/output";
import {ObjectId, SortDirection, WithId} from "mongodb";
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
static async getAllPostsForBlog(blogId: string):Promise<PostOutputType[] | null> {
    const posts: WithId<PostMongoDbType>[] | null = await postCollection.find({blogId: blogId}).toArray()
if (!posts){
    return null
}

// static async getAll(title: string | null | undefined):Promise<PostOutputType[]> {
//         const posts  = await postCollection.find({}).toArray()
//         return posts.map(post => PostMapper.toDto(post))
//     }

return posts.map((post) => PostMapper.toDto(post))
}
// 1) передать page number
    //2) Посчитать скип


    // const filter = {
    //      ...blogId,
    //      _id: {$in: [new ObjectId(someStringId), ...]}
    //      ...search,
    // }

static async getAll(sortData: blogSortData):Promise<BlogOutputType[]> {
    const {pageSize, pageNumber, sortBy, sortDirection, searchNameTerm} = sortData
    const search = searchNameTerm
        ? {name: {$regex: searchNameTerm, $options: 'i'}}
        : {}
    const  blog = await blogCollection
        .find(search)
        .sort(sortBy, sortDirection as SortDirection) //был вариант(sortBy as keyof BlogOutputType, sortDirection as SortDirection))
        .limit(pageSize)
        .skip((pageNumber - 1) * pageSize)
        .toArray()
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
