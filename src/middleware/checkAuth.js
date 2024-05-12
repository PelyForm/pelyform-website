
const { errorNames } = require("../config/constant");
const tokenDB = require("../database/tokenDB");
const ApiError = require("../lib/ApiError");
const { verifyToken } = require("../lib/token");

const UNAUTHORIZED_ERROR = errorNames.UNAUTHORIZED_ERROR;
const ERROR_MSG = {
    MISSING_HEADER: "Missing Authorization Header",
    MISSING_TOKEN: "Missing token in Authorization Header",
    TOKEN_BLACKLISTED: "Token is blacklisted",
    VERIFY_FAIL: "Cannot verify token"
}

function handleUnauthorizedError(next, message) {
    next(new ApiError({ message }, UNAUTHORIZED_ERROR, 401));
}

function checkAuthBuilder(secret, roles=[]) {
    return async function checkAuth(req, res, next) {
        const { authorization: authHeader } = req.headers;

        if (!authHeader) {
            return handleUnauthorizedError(next, ERROR_MSG.MISSING_HEADER);
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return handleUnauthorizedError(next, ERROR_MSG.MISSING_TOKEN);
        }

        try {
            const blackListed = await tokenDB.readOne({ token });
            if (blackListed) {
                return handleUnauthorizedError(next, ERROR_MSG.TOKEN_BLACKLISTED);
            }

            const payload = await verifyToken(token, secret);

            if(roles.length && !roles.includes(payload.role)){
                return handleUnauthorizedError(next, ERROR_MSG.MISSING_TOKEN);
            }
            
            req.user = payload;
            next();
        } catch (error) {
            console.error(`Error during token verification: ${error}`);
            handleUnauthorizedError(next, ERROR_MSG.VERIFY_FAIL);
        }
    }
}

module.exports = checkAuthBuilder;
