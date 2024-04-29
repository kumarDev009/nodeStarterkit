import { fetchUserByEmail, fetchUserById, fetchAllUsers, deleteUserDetails, resetPwd, updateUserDetails } from "../models/user.model.js";
import { errorHandler } from '../middlewares/errorHandler.js';
import { successHandler } from '../middlewares/successHandler.js';
import { updateOTP } from "../models/forgetPassword.model.js";
import { generateOTP } from "../utils/OTPHandling.js";
import handleSendMail from "../services/email.service.js";
import { insertData } from "../models/user.model.js";
import { DEFAULT_PARAMETERS, ENDPOINTS, ERROR_MESSAGE, ROLES, STATUS, SUCCESS_MESSAGE } from "../utils/constants.js";
import { errorLogger, infoLogger } from "../middlewares/logger.js";
import { loggerLogFormat } from "../utils/HelperFunction.js";
import { emailExists, hashPassword } from '../middlewares/passwordHasing.js';

const deleteUser = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		errorHandler(STATUS.NOT_AUTHENTICATED.CODE, res, {
			error: ERROR_MESSAGE.ID_REQUIRED
		});
	} else {
		try {
			const hasUser = await deleteUserDetails(id);
			if (hasUser.rowCount) {
				infoLogger.info(
					loggerLogFormat(ENDPOINTS.DELETE_USER, req.body, {
						message: SUCCESS_MESSAGE.REMOVE_USER
					})
				);
				successHandler(STATUS.ACCEPTED.CODE, res, {
					message: SUCCESS_MESSAGE.REMOVE_USER
				});
            } else {
                errorLogger.error(
                    loggerLogFormat(ENDPOINTS.DELETE_USER, req.body, { error : ERROR_MESSAGE.USER_ID_NOT_EXIST })
                );
				 errorHandler(STATUS.BAD_REQUEST.CODE, res, {
					error: ERROR_MESSAGE.USER_ID_NOT_EXIST
				});
			}
        } catch (error) {
            errorLogger.error(
                loggerLogFormat(ENDPOINTS.DELETE_USER, req.body, { error : ERROR_MESSAGE.WENT_WRONG })
            );
			errorHandler(STATUS.BAD_REQUEST.CODE, res, {
				error: ERROR_MESSAGE.WENT_WRONG
			});
		}
	}
};


const updateUser = async (req, res) => {
    const { id } = req.params;
    let error = '';
    const { first_name, last_name, address1, address2, city, state, zip_code } = req.body;
	if (!id) {
		return errorHandler(STATUS.BAD_REQUEST.CODE, res, {
			message: ERROR_MESSAGE.USER_ID_REQUIRED
		});
	}else{
        const result = await fetchUserById(id);
        if (result.rows.length) {
            if (
                (address1 || address2 || city || state || zip_code) &&
                first_name &&
                last_name
            ) {
                if (address1 && address2 && city && state && zip_code) {
                    let response = await updateUserDetails(req.body, id);
                    infoLogger.info(loggerLogFormat(ENDPOINTS.UPDATE_USER, req.body, response));
                    return successHandler(STATUS.SUCCESS.CODE, res, {
                        message: SUCCESS_MESSAGE.USER_DETAILS_UPDATE
                    });
                } else {
                    errorLogger.error(loggerLogFormat(ENDPOINTS.UPDATE_USER, req.body, { message: ERROR_MESSAGE.VALID_ADDRESS }));
                    return res.status(400).json({ message: ERROR_MESSAGE.VALID_ADDRESS });
                }
            }
            if (first_name && last_name) {
                await updateUserDetails(req.body, id);
                infoLogger.info(loggerLogFormat(ENDPOINTS.UPDATE_USER, req.body, {
                    message: SUCCESS_MESSAGE.USER_DETAILS_UPDATE
                }));
                return successHandler(STATUS.SUCCESS.CODE, res, {
                    message: SUCCESS_MESSAGE.USER_DETAILS_UPDATE
                });
            } else {
                errorLogger.error(loggerLogFormat(ENDPOINTS.UPDATE_USER, req.body, { error: ERROR_MESSAGE.NAMES_ARE_REQUIRED }));
                return errorHandler(STATUS.BAD_REQUEST.CODE, res, {
                    error: ERROR_MESSAGE.NAMES_ARE_REQUIRED
                });
            }
        } else {
            return errorHandler(STATUS.BAD_REQUEST.CODE, res, { error: ERROR_MESSAGE.USER_NOT_FOUND });
        }
    }
};


const getUserById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return errorHandler(STATUS.BAD_REQUEST.CODE, res, { message: ERROR_MESSAGE.USER_ID_REQUIRED });
    } else {
        try {
            const result = await fetchUserById(id);
            if (result.rows.length) {
                infoLogger.info(
                    loggerLogFormat(ENDPOINTS.GET_USER_BY_ID, { id }, { response: result.rows })
                );
                return successHandler(STATUS.SUCCESS.CODE, res, result.rows);
            } else {
                return errorHandler(STATUS.BAD_REQUEST.CODE, res, { error: ERROR_MESSAGE.USER_NOT_FOUND });
            }
        }
        catch (error) {
            errorLogger.error(
                loggerLogFormat(ENDPOINTS.GET_USER_BY_ID, { id }, { error })
            );
            return errorHandler(STATUS.BAD_REQUEST.CODE, res, { error: ERROR_MESSAGE.WENT_WRONG });
        }
    }
}

const getUserByEmail = async (req, res) => {
	const { email } = req.params;
	if (!email) {
		return errorHandler(STATUS.BAD_REQUEST.CODE, res, {
			message: ERROR_MESSAGE.USER_EMAIL_REQUIRED
		});
	} else {
		try {
			const result = await fetchUserByEmail(email);
			if (result.rows.length) {
				infoLogger.info(
					loggerLogFormat(
						ENDPOINTS.GET_USER_BY_EMAIL,
						{ email },
						{ response: result.rows }
					)
				);
				return successHandler(STATUS.SUCCESS.CODE, res, result.rows);
			} else {
                return errorHandler(STATUS.BAD_REQUEST.CODE, res, { error: ERROR_MESSAGE.USER_NOT_FOUND });

			}
		} catch (err) {
			errorLogger.error(
				loggerLogFormat(ENDPOINTS.GET_USER_BY_EMAIL, { email }, { error })
			);
			return errorHandler(STATUS.BAD_REQUEST.CODE, res, {
				error: ERROR_MESSAGE.WENT_WRONG
			});
		}
	}
};

const getAllUsers = async (req, res) => {
	const pageSize =
		parseInt(req?.query?.pageSize) || DEFAULT_PARAMETERS.PAGE_SIZE;
	const page = parseInt(req?.query?.page) || DEFAULT_PARAMETERS.PAGE;
	const offset = (page - 1) * pageSize;

    try {
        const result = await fetchAllUsers({ pageSize, offset, search_terms: req?.query?.search_terms });
        infoLogger.info(
            loggerLogFormat(ENDPOINTS.GET_ALL_USERS, { role: ROLES.ADMIN }, { response: result.rows })
        );
        return successHandler(STATUS.SUCCESS.CODE, res, result.rows);
    } catch (error) {
        errorLogger.error(
            loggerLogFormat(ENDPOINTS.GET_ALL_USERS, { role: ROLES.ADMIN }, { error })
        );
        return errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { error: ERROR_MESSAGE.WENT_WRONG });
    }
};

const register = async (req, res)=>{

    const { firstName, lastName, email, password } = req.body;

    const alreadyExistsUser = await emailExists(email)

    if (alreadyExistsUser) {
      let response = { message: ERROR_MESSAGE.EMAIL_EXIST };
      infoLogger.info(loggerLogFormat(ENDPOINTS.REGISTER, req.body, response));
      return errorHandler(STATUS.BAD_REQUEST.CODE, res, response);
    }

    const password_hash = await hashPassword(password)

    const storeData = {
      email : req.body.email,
      password_hash: password_hash,
      first_name : req.body.firstName,
      last_name : req.body.lastName,
      full_name : firstName + lastName,
      dob: req.body.dob,
      status: 'Pending'
    }

    const newUser = await insertData(storeData)

    const otp = await generateOTP()

    const otpObj = {
      email: email,
      otp: otp
    }

    if(newUser.rowCount === 1){

      const response = await updateOTP(otpObj)
      if (response.rowCount == 1) {
        const emailData = {
          toEmailAddress: email,
          subject: 'Account verification',
          bodyContent_1: `Your account verification code is: <b>${otp}</b>`,
          bodyContent_2: `Use this code to verify your account in mitrah-starter-kit.`,
          response_msg: "The code has been sent to your registered email, Please use that code to verify your account"
        }
        handleSendMail(emailData, res, req)
      }
    }
  }

const resetPassword = async (req, res) => {

    const { email, oldPassword, newPassword } = req.body
    const response = await fetchUserByEmail(email)
    if (response.rowCount == 1) {
        const isOldPasswordValid = await ComparePassword(oldPassword, response.rows[0].password_hash)
        if (isOldPasswordValid) {
            const password_hash = await hashPassword(newPassword)
            const responseData = await resetPwd(email, password_hash)
            if (responseData.rowCount == 1) {
                let response = { message: SUCCESS_MESSAGE.RESET_PASSWORD };
                infoLogger.info(loggerLogFormat(ENDPOINTS.RESET_PASSWORD, req.body, response));
                return successHandler(STATUS.SUCCESS.CODE, res, response)
            } else {
                errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { message: ERROR_MESSAGE.WENT_WRONG });
            }
        } else {
            let responseMsg = { message: ERROR_MESSAGE.OLD_PASSWORD_INCORRECT };
            errorLogger.error(loggerLogFormat(ENDPOINTS.RESET_PASSWORD, req.body, responseMsg));
            errorHandler(STATUS.NOT_FOUND.CODE, res, responseMsg);
        }
    } else {
        let responseMsg = { message: STATUS.NOT_FOUND.TEXT };
        resetOTP(email);
        errorLogger.error(loggerLogFormat(ENDPOINTS.RESET_PASSWORD, req.body, responseMsg));
        errorHandler(STATUS.NOT_FOUND.CODE, res, responseMsg);
    }
}

export default { getAllUsers, getUserById, getUserByEmail, deleteUser, resetPassword, updateUser, register };
