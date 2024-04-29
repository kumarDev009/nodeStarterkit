import express from 'express';
import { body } from 'express-validator';

import { jwtSign } from '../middlewares/jwtToken.js';
import passport from '../middlewares/passport.js';
import authController from '../controllers/auth.controller.js';
import { updateOTP } from '../models/forgetPassword.model.js';
import { generateOTP } from '../utils/OTPHandling.js';
import handleSendMail from '../services/email.service.js';
import { errorLogger, infoLogger } from '../middlewares/logger.js';
import { loggerLogFormat } from '../utils/HelperFunction.js';
import {
	ENDPOINTS,
	ERROR_MESSAGE,
	REGEX,
	STATUS,
	SUCCESS_MESSAGE
} from '../utils/constants.js';
import { errorHandler } from '../middlewares/errorHandler.js';
import { successHandler } from '../middlewares/successHandler.js';
import { validateRequest } from '../middlewares/expressValidator.js';

/**
 * @swagger
 * components :
 *      schemas :
 *          Login :
 *              type : object
 *              required :
 *                  - email
 *                  - password
 *              properties :
 *                  email :
 *                      type : string
 *                      example : demo@gmail.com
 *                  password :
 *                      type : string
 *                      example : password
 *          LoginSuccess :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Authentication success
 *                  data :
 *                      type : object
 *                      properties :
 *                          id :
 *                              type : string
 *                              example : 59d115f9-e8fd-43ca-9d61-8c16e052afa5
 *                          email :
 *                              type : string
 *                              example : demo@gmail.com
 *                          firstName :
 *                              type : string
 *                              example : demo
 *                          lastName :
 *                              type : string
 *                              example : test
 *                          role :
 *                              type : string
 *                              example : Admin
 *                          token :
 *                              type : string
 *                              example : eyJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImRlbW9AZ21haWwuY29tIn0.eXOIzgCRDJ-qTk_UzE6e1Zgdcbb62VPeQ6kPNPVeET0
 *          UnAuthorized :
 *               type : object
 *               properties :
 *                  message :
 *                      type : string
 *                      example : Account is not recognized.
 *          InconvienceResponse :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Sorry for the inconvenience
 *          VerifyUser :
 *              type : object
 *              properties :
 *                  email :
 *                      type : string
 *                      example : demo@gmail.com
 *                  userVerificationCode :
 *                      type : number
 *                      example : 1234
 *          InvalidVerificationCode :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Invalid verification code/ Verification code  has expired
 *          VerifiedUser :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Your account has been verified!
 * /login :
 *      post :
 *          tags : [Authentication]
 *          summary : Use this endpoint to authenticate a user and obtain an access token with user details.
 *          security :
 *                - bearerAuth : []
 *                - credentialAuth : []
 *          requestBody :
 *                description : Provide the following details in JSON format for authenticate the user.
 *                content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/Login'
 *                    application/x-www-form-urlencode :
 *                       schema :
 *                           $ref : '#/components/schemas/Login'
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/LoginSuccess'
 *               401 :
 *                  description : Unauthorized
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/UnAuthorized'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 * /verify_user :
 *      post :
 *          tags : [Authentication]
 *          summary : API to activate the user status after verify the OTP (One-Time-Password)
 *          security :
 *                - bearerAuth : []
 *                - credentialAuth : []
 *          requestBody :
 *               description : Provide the following details in JSON format to activate the user status.
 *               content :
 *                   application/json :
 *                      schema :
 *                          $ref : '#/components/schemas/VerifyUser'
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/VerifiedUser'
 *               400 :
 *                  description : Bad request
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InvalidVerificationCode'
 */

const router = express.Router();

router.post(
	ENDPOINTS.LOGIN,
	validateRequest([
		body('email').isEmail().withMessage('Email must be valid'),
		body('password')
			.matches(REGEX.PASSWORD)
			.withMessage(
				'Incorrect Password'
			)
	]),
	(req, res, next) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) return next(err);
			if (!user) {
				// Authentication failed
				let response = { message: info.message };
				errorLogger.error(loggerLogFormat(ENDPOINTS.LOGIN, req.body, response));
				return errorHandler(STATUS.NOT_AUTHENTICATED.CODE, res);
			}

			// Authentication succeeded
			req.logIn(user, async err => {
				if (user.status == 'Active') {
					const dataObj = {
						email: user.email,
						role: user.role
					};
					const token = await jwtSign(dataObj);
					user.token = token;
					if (err) {
						errorLogger.error(loggerLogFormat(LOGIN, req.body, err));
						return next(err);
					} else {
						let message = SUCCESS_MESSAGE.LOGIN_SUCCESS;
						infoLogger.info(
							loggerLogFormat(ENDPOINTS.LOGIN, req.body, { message })
						);
						return successHandler(STATUS.SUCCESS.CODE, res, {
							message,
							data: user
						});
					}
				} else if (user.status == 'Pending') {
					const otp = await generateOTP();

					const otpObj = {
						email: user.email,
						otp: otp
					};

					const response = await updateOTP(otpObj);

					if (response.rowCount == 1) {
						const emailData = {
							toEmailAddress: user.email,
							subject: 'Account verification',
							bodyContent_1: `Your account verification code is: <b>${otp}</b>`,
							bodyContent_2: `Use this code to verify your account in mitrah-starter-kit.`,
							response_msg:
								'The code has been sent to your registered email, Please use that code to verify your account'
						};

						handleSendMail(emailData, res, req);
					}
				} else {
					let message = ERROR_MESSAGE.USER_NOT_FOUND;
					infoLogger.info(
						loggerLogFormat(ENDPOINTS.LOGIN, req.body, { message })
					);
					return errorHandler(STATUS.NOT_FOUND.CODE, res, {
						message,
						data: user
					});
				}
			});
		})(req, res, next);
	}
);

router.post(ENDPOINTS.VERIFY_USER, authController.verifyUser);

export default router;
