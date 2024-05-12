
const path = require("path")
const { isObject } = require("../lib/isAnything")
const { rootDirectory } = require("../../directory")


// const options = {
//     multiples: true,
//     uploadDir: path.join(rootDirectory, "public", "file", "upload"),
//     maxFileSize: 10 * 1024 * 1024,
//     keepExtensions: true,
// }



async function parser(req, res, next) {
    try {
        if (req.method == "post" || req.method == "put") req.body = req.body
        if (req.method == "get" || req.method == "delete") req.query = req.query
        next()
    } catch (error) {
        next(error)
    }
}


// function parseRequest(approvedFields = [], approvedExt = ["pdf", "png", "jpg", "jpeg", "doc", "docx", "xlsx", "xls", "word", "webp", "json", "gif"]) {
//     return function (req, res, next) {
//         const body = req.body
//         const files = {}
//         const filesError = {}
//         for (let field of approvedFields) {

//             if (field in body) {
//                 files[field] = []

//                 if (isObject(body[field])) body[field] = [body[field]]

//                 for (let file of body[field]) {

//                     if (file.name && file.type) {


//                         const fileType = file.type.split("/")[1]
//                         if (approvedExt.includes(fileType)) {
//                             files[field] = [...files[field], file,]
//                         }
//                         else {
//                             filesError[field] = "invalid file extension " + fileType
//                         }
//                     }
//                     else {
//                         filesError[field] = "can't upload empty file " + field
//                     }
//                 }
//                 delete body[field]
//             }
//         }
//         if (Object.keys(filesError).length) next(filesError)
//         req.body = body
//         req.files = files
//         next()
//     }
// }

function parseRequest(req) {
    try {
        const defaultPage = 1;
        const defaultSortOrder = 'desc';
        const defaultLimit = 20;

        const page = parseInt(req.query?.page) || defaultPage;
        const sortBy = req.query?.sortBy || 'updatedAt';
        const sortOrder = req.query?.sortOrder || defaultSortOrder;
        const limit = parseInt(req.query?.limit) || defaultLimit;

        const paginationKeys = ['page', 'sort', 'sortOrder', 'limit'];
        const resolve = {};
        const filter = Object.keys(req.query).reduce((acc, key) => {
            if (key.startsWith('get')) {
                const resolveKey = key.slice(3);
                resolve[resolveKey.charAt(0).toLowerCase() + resolveKey.slice(1)] = req.query[key];
            } else if (!paginationKeys.includes(key)) {
                acc[key] = req.query[key];
            }
            return acc;
        }, {});

        const projection = []
        const pagination = { page, sortBy, sortOrder, limit };

        return {
            filter: {
                equal: filter,
                notEqual: {}
            }, resolve, pagination, projection
        };
    } catch (error) {
        console.error('Error parsing request:', error);
        throw new Error('Failed to parse request');
    }
}





module.exports = {
    parser,
    parseRequest
}