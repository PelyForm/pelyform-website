const ApiError = require("../lib/ApiError");
const { isObject } = require("../lib/isAnything");


module.exports = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let status = err.status || 'error';
    let errors = {};
    let apiMessage = '';
    let code = err.message || "Error";
    console.log(err);
    // Handle MongoDB/Mongoose errors
    if (err instanceof TypeError) {
        statusCode = 500;
        errors = { message: "Error" };
        err = new ApiError(errors, "Type Error", statusCode);
    }

    // Handle JavaScript RangeError
    else if (err instanceof RangeError) {
        statusCode = 500;
        errors = { message: "Error" };
        err = new ApiError(errors, "Range Error", statusCode);
        

    }

    // Handle JavaScript ReferenceError
    else if (err instanceof ReferenceError) {
        statusCode = 500;
        errors = { message: "Error" };
        err = new ApiError(errors, "Reference Error", statusCode);
    }

    else if (err.name === 'MongoServerError' && err.code === 11000) {
        statusCode = 409;
        status = 'fail';
        const field = Object.keys(err.keyValue)[0];
        err = new ApiError({ [field]: "already exists" }, message = "Validation Error", statusCode);
    }

    else if (err.name === 'ValidationError') {
        statusCode = 400;
        errors = {};

        if (err.inner) {  // This is a Yup error
            err.inner.forEach((error) => {
                errors[error.path] = error.message;
            });
        } else {  // This is a Mongoose error
            errors = err.errors;
            Object.keys(errors).forEach((key) => {
                switch (errors[key].kind) {
                    case 'required':
                        errors[key] = `${key} is required.`;
                        break;
                    case 'min':
                        errors[key] = `${key} is below the minimum.`;
                        break;
                    case 'max':
                        errors[key] = `${key} is above the maximum.`;
                        break;
                    case 'enum':
                        errors[key] = `${key} is not an allowed value.`;
                        break;
                    default:
                        errors[key] = errors[key].message;
                }
            });
        }
        code = err.message || "Error"
        console.log(errors);
        err = new ApiError(errors, "Validation Error", statusCode);
    }


    //mongodb data type error
    else if (err.name === 'CastError') {
        statusCode = 400;
        err = new ApiError({ [err.path]: `Invalid ${err.kind}` }, "Validation Error", statusCode);
    }

    apiMessage = Object.values(errors).join('|| ');

    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        status = err.status;
        errors = isObject(err.errors) ? err.errors : { message: err.errors };
        apiMessage = Object.values(errors).join('|| ');
        code = err.apiCode || "Error"

    }

    //handle all other possible errors
    else {
        statusCode = 500;
        status = 'error';
        errors = { message: err.message };
        apiMessage = Object.values(errors).join('|| ');
        code = "Error"
    }
    
    

    res.status(statusCode).json({
        success: false,
        message: apiMessage,
        errors,
        status,
        statusCode,
        code

    });


};
