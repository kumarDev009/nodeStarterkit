import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/index.js';
import { errorHandler } from './errorHandler.js';
import { ERROR_MESSAGE, STATUS } from '../utils/constants.js';

// Function for create token
export const jwtSign = async (data) => {
    const token = await jwt.sign(JSON.stringify(data), jwtConfig.jwtsecret);
    return token;
};

// Function for verify token
export const jwtVerify = async (authorization) => {
    const verifyToken = await jwt.verify(authorization, jwtConfig.jwtsecret);
    return verifyToken;
};

export const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization')
    if (authHeader) {
        const token = authHeader?.includes('Bearer') ? authHeader.split(" ")[1] : authHeader

        jwt.verify(token, jwtConfig.jwtsecret, (err, user) => {
            if (err) {
                return errorHandler(STATUS.NOT_AUTHORIZED.CODE, res, { error: ERROR_MESSAGE.INVALID_TOKEN });
            }
            req.role = user.role;
            next();
        });
    } else {
        return errorHandler(STATUS.NOT_AUTHORIZED.CODE, res);

    }
};

export const verifyRoles = (allowedRoles) => (req, res, next) => {
    const hasRole = allowedRoles.some(role => role === req.role)

    if (!allowedRoles?.length) {
        return errorHandler(STATUS.BAD_REQUEST.CODE, res, { error: ERROR_MESSAGE.USER_ROLE_NOT_FOUND });
    }
    else if (!req.role) {
        return errorHandler(STATUS.BAD_REQUEST.CODE, res, { error: ERROR_MESSAGE.ROLE_NOT_PROVIDE_TO_MIDDLEWARE });
    }
    else if (!hasRole) {
        return errorHandler(STATUS.NOT_AUTHORIZED.CODE, res, { error: ERROR_MESSAGE.USER_NOT_AUTHORIZED });
    } else {
        next()
    }
}

export const middlewares = (roles) => {
    return [authenticateJWT, verifyRoles(roles)]
}
