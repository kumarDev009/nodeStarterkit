import { statusUpdate } from '../models/auth.model.js';
import { resetOTP } from '../models/forgetPassword.model.js';
import { isValidOtp, isOTPExpired } from '../utils/OTPHandling.js';
import { successHandler } from '../middlewares/successHandler.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import {
	ENDPOINTS,
	ERROR_MESSAGE,
	STATUS,
	SUCCESS_MESSAGE
} from '../utils/constants.js';
import { loggerLogFormat } from '../utils/HelperFunction.js';
import { errorLogger, infoLogger } from '../middlewares/logger.js';

const verifyUser = async (req, res) => {
	try {
		const { email, userVerificationCode } = req.body;

		const isValidOTP = await isValidOtp(email, userVerificationCode); // Check if the OTP is valid or not

		const isExpired = await isOTPExpired(email); // Check if the OTP is expired or not

		if (!isValidOTP) {
			let response = { message: ERROR_MESSAGE.INVALID_OTP };
			infoLogger.info(
				loggerLogFormat(ENDPOINTS.VERIFY_USER, req.body, response)
			);
			return errorHandler(STATUS.BAD_REQUEST.CODE, res, response);
		} else if (!isExpired) {
			resetOTP(email);
			let response = { message: ERROR_MESSAGE.OTP_EXPIRED };
			infoLogger.info(
				loggerLogFormat(ENDPOINTS.VERIFY_USER, req.body, response)
			);
			return errorHandler(STATUS.BAD_REQUEST.CODE, res, response);
		} else {
			statusUpdate(email);

			let response = { message: SUCCESS_MESSAGE.USER_VERIFICATION };
			infoLogger.info(
				loggerLogFormat(ENDPOINTS.VERIFY_USER, req.body, response)
			);
			return successHandler(STATUS.SUCCESS.CODE, res, response);
		}
	} catch (error) {
		errorLogger.error(loggerLogFormat(ENDPOINTS.VERIFY_USER, req.body, error));
		errorHandler(STATUS.INTERNAL_ERROR.CODE, res, {
			message: ERROR_MESSAGE.WENT_WRONG
		});
	}
};

export default { verifyUser };
