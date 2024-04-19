import {body, validationResult, query, param} from "express-validator"
import {inputValidationMiddleware} from "../middlewares/inputValidation/input-validation-middleware";


const nameValidator = body('name').isString().withMessage('Name must be a string').trim().isLength({
    min: 1,
    max: 15
}).withMessage('Incorrect name length')

const descriptionValidator = body('description').isString().withMessage('Description must be a string').trim().isLength({
    min: 1,
    max: 500
}).withMessage('Incorrect description')

const websitUrlValidator = body('websiteUrl').isString().withMessage('WebsiteUrl must be a string').trim().isLength({
    min: 1,
    max: 100
}).matches( 'https:\\/\\/([a-zA-Z0-9_-]+\\.)+[a-zA-Z0-9_-]+(\\/[a-zA-Z0-9_-]+)*\\/?$'
).withMessage('Incorrect websieUrl')

export const blogValidation = () =>[nameValidator, descriptionValidator, websitUrlValidator, inputValidationMiddleware]


/*

// варианты задания дефолтных значений
return {
        pageNumber: query.pageNumber ? +query.pageNumber : 1,
        pageSize: query.pageSize !== undefined ? +query.pageSize : 10,
        sortBy: query.sortBy ? query.sortBy : 'createdAt',
        sortDirection: query.sortDirection ? query.sortDirection as SortDirection : 'desc',
        searchNameTerm: query.searchNameTerm ? query.searchNameTerm : null,
    }

 */