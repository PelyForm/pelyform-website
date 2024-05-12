const permissions = require("../config/accessControl")
const { errorNames, paginationParameters } = require("../config/accessControl/constant")
const { validateBodyParameters, validateQueryParameters } = require("../config/validateRequest")

const ApiError = require("../lib/ApiError")
const { deepClone } = require("../lib/isAnything")



function permissionsMiddleware(resource, action){
    return async function(req, res, next){
        try {
            const { role } = req.user
            const permission = permissions[role][resource][action] 
            if(permission && permission.access){
    
                const clonedPermission = deepClone(permission)
                req.permission = clonedPermission
                const { body, query, response, resolve, restrictions } = clonedPermission

                const queryValidation = validateQueryParameters(req.query, query, resolve, restrictions,Object.values(paginationParameters), response)
                const bodyValidation = validateBodyParameters(req.body, body, restrictions.body)
    
                let error = {}
                
                if(queryValidation.error) error = {...error, ...queryValidation.data}
                if(bodyValidation.error) error = {...error, ...bodyValidation.data}
    
                if(Object.keys(error).length > 0){
                    return next(new ApiError(error, errorNames.FORBIDDEN_ERROR, 403))
                }

    
                req.formatted = {
                    query: queryValidation.data,
                    body: bodyValidation.data
                }
                
                next()
            }else{
                next(new ApiError({message: "Access denied"},  errorNames.FORBIDDEN_ERROR , 403))
            }
        } catch (error) {
            next(error)
        }
    }

    

}

module.exports = permissionsMiddleware