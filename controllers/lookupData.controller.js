import { fetchCountries, fetchRoles, fetchStatuses } from '../models/lookupData.model.js';
import { errorLogger, infoLogger } from '../middlewares/logger.js';
import { loggerLogFormat } from '../utils/HelperFunction.js';
import { ENDPOINTS, ERROR_MESSAGE, STATUS, SUCCESS_MESSAGE } from '../utils/constants.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { successHandler } from '../middlewares/successHandler.js';


const getCountries =async (req,res) => {
    try {
        const response = await fetchCountries()
        if (response.rows.length){
        let message = SUCCESS_MESSAGE.GET_COUNTRIES_DATA_SUCCESS;
            infoLogger.info(loggerLogFormat(ENDPOINTS.GET_COUNTRIES, req.body, { message }));
            return successHandler(STATUS.SUCCESS.CODE, res, { message, data: response.rows });
        }else{
            errorLogger.error(loggerLogFormat(ENDPOINTS.GET_COUNTRIES, req.body, error));
            errorHandler(STATUS.NOT_FOUND.CODE, res, { message: STATUS.NOT_FOUND.TEXT });
        }
    } catch (error) {
        errorLogger.error(loggerLogFormat(ENDPOINTS.GET_COUNTRIES, req.body, error));
        errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { message: ERROR_MESSAGE.WENT_WRONG });
    }
}

const getRoles = async (req,res) => {
    try {
        const response = await fetchRoles()
        if (response.rows.length) {
            let message = SUCCESS_MESSAGE.GET_ROLES_DATA_SUCCESS;
            infoLogger.info(loggerLogFormat(ENDPOINTS.GET_ROLES, req.body, { message }));
            return successHandler(STATUS.SUCCESS.CODE, res, { message, data: response.rows });
        } else {
            errorLogger.error(loggerLogFormat(ENDPOINTS.GET_ROLES, req.body, error));
            errorHandler(STATUS.NOT_FOUND.CODE, res, { message: STATUS.NOT_FOUND.TEXT });
        }
    } catch (error) {
        errorLogger.error(loggerLogFormat(ENDPOINTS.GET_ROLES, req.body, error));
        errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { message: ERROR_MESSAGE.WENT_WRONG });
    }
}

const getStatus = async (req, res) => {
    try {
        const response = await fetchStatuses()
        if (response.rows.length) {
            let message = SUCCESS_MESSAGE.GET_STATUS_SUCCESS;
            infoLogger.info(loggerLogFormat(ENDPOINTS.GET_STATUS, req.body, { message }));
            return successHandler(STATUS.SUCCESS.CODE, res, { message, data: response.rows });
        } else {
            errorLogger.error(loggerLogFormat(ENDPOINTS.GET_STATUS, req.body, error));
            errorHandler(STATUS.NOT_FOUND.CODE, res, { message: STATUS.NOT_FOUND.TEXT });
        }
    } catch (error) {
        errorLogger.error(loggerLogFormat(ENDPOINTS.GET_STATUS, req.body, error));
        errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { message: ERROR_MESSAGE.WENT_WRONG });
    }
}

export default { getCountries, getRoles, getStatus }