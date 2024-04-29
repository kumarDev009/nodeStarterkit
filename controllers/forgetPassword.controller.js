import { emailExists, hashPassword } from '../middlewares/passwordHasing.js';
import { generateOTP, isValidOtp, isOTPExpired } from '../utils/OTPHandling.js';
import {
	updateOTP,
	resetOTP,
	updatePwdQuery
} from '../models/forgetPassword.model.js';
import handleSendMail from '../services/email.service.js';
import { errorLogger, infoLogger } from '../middlewares/logger.js';
import { loggerLogFormat } from '../utils/HelperFunction.js';
import { ENDPOINTS, ERROR_MESSAGE, STATUS, SUCCESS_MESSAGE } from '../utils/constants.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { successHandler } from '../middlewares/successHandler.js';

const sendOTP = async (req, res) => {
	const { email } = req.body;
	try {
		const isEmailVald = await emailExists(email);

		if (!isEmailVald) {
			let responseMsg = { message: ERROR_MESSAGE.VALID_EMAIL };
			errorHandler(STATUS.NOT_FOUND.CODE, res, responseMsg);
			errorLogger.error(loggerLogFormat(ENDPOINTS.GENERATE_OTP, req.body, responseMsg));
		} else {
			const otp = await generateOTP();

			const otpObj = {
				email: email,
				otp: otp
			};

			const response = await updateOTP(otpObj);
			if (response.rowCount == 1) {
				const emailData = {
					toEmailAddress: email,
					subject: 'Reset Password',
					bodyContent_1: `Your  password reset verification code is: <b>${otp}</b>`,
					bodyContent_2:
						'Use this code to reset your password in mitrah-starter-kit.',
					response_msg: 'Verification code sent successfully'
				};
				handleSendMail(emailData, res, req);
			}
		}
	} catch (error) {
		errorLogger.error(loggerLogFormat(ENDPOINTS.GENERATE_OTP, req.body, error));
		errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { message  : ERROR_MESSAGE.WENT_WRONG});
	}
};

const validateOTP = async (req, res) => {
	try {
		const { email, passwordResetCode } = req.body;

		const isValidOTP = await isValidOtp(email, passwordResetCode); // Check if the OTP is valid or not

		const isExpired = await isOTPExpired(email); // Check if the OTP is expired or not

		if (!isValidOTP) {
			let responseMsg = { message: ERROR_MESSAGE.INVALID_OTP };
			errorLogger.error(loggerLogFormat(ENDPOINTS.VERIFY_OTP, req.body, responseMsg));
			errorHandler(STATUS.BAD_REQUEST.CODE, res, responseMsg);
		} else if (!isExpired) {
			let responseMsg = { message: ERROR_MESSAGE.OTP_EXPIRED };
			resetOTP(email);
			errorLogger.error(loggerLogFormat(ENDPOINTS.VERIFY_OTP, req.body, responseMsg));
			errorHandler(STATUS.BAD_REQUEST.CODE, res, responseMsg);
		} else {
			let responseMsg = { message: SUCCESS_MESSAGE.PASSWORD_CHANGE_MSG };
			resetOTP(email);
			infoLogger.info(loggerLogFormat(ENDPOINTS.VERIFY_OTP, req.body, responseMsg));
			successHandler(STATUS.SUCCESS.CODE, res, responseMsg);
		}
	} catch (error) {
		errorLogger.error(loggerLogFormat(ENDPOINTS.VERIFY_OTP, req.body, error));
		errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { message  : ERROR_MESSAGE.WENT_WRONG});
	}
};

export const forgotPassword = async (req, res) => {
	try {
		const { email, newPassword } = req.body;
		const password_hash = await hashPassword(newPassword);
		const updatePwdData = {
			email: email,
			password_hash: password_hash
		};
		const response = await updatePwdQuery(updatePwdData);
		if (response.rowCount == 1) {
			let responseMsg = { message: SUCCESS_MESSAGE.FORGOT_PASSWORD };
			infoLogger.info(loggerLogFormat(ENDPOINTS.FORGOT_PASSWORD, req.body, responseMsg));
			successHandler(STATUS.SUCCESS.CODE, res, responseMsg);
		}
	} catch (error) {
		errorLogger.error(loggerLogFormat(ENDPOINTS.FORGOT_PASSWORD, req.body, error));
		errorHandler(STATUS.INTERNAL_ERROR.CODE, res, { message  : ERROR_MESSAGE.WENT_WRONG});
	}
};

export default { sendOTP, validateOTP, forgotPassword };
