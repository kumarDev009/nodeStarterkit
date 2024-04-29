import express from 'express';

import forgetPasswordController from '../controllers/forgetPassword.controller.js';
import { ENDPOINTS, REGEX } from '../utils/constants.js';
import { validateRequest } from '../middlewares/expressValidator.js';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * components :
 *      schemas :
 *          GenerateOtp :
 *              type : object
 *              required : 
 *                  - email
 *              properties :
 *                  email :
 *                      type : string
 *                      example : demo@gmail.com
 *          GenerateOtpSuccess :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : OTP sent successfully
 *                  code :
 *                      type : string
 *                      example : verify_code
 *          InvalidEmail :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Please enter valid email
 *          verifyOtp :
 *              type : object
 *              required : 
 *                  - email 
 *                  - passwordResetCode
 *              properties :
 *                  email :
 *                      type : string
 *                      example : demo@gmail.com
 *                  verificationCode :
 *                      type : number
 *                      example : 1234
 *          InvalidOtp :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Invalid Otp/ OTP has expired
 *          VerifySuccess :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : You can change your password now!
 *          PasswordUpdate :
 *              type : object
 *              required : 
 *                  - email 
 *                  - newPassword
 *              properties :
 *                  email :
 *                      type : string
 *                      example : demo@gmail.com
 *                  newPassword :
 *                      type : string
 *                      example : password1
 *          PasswordUpdateSuccess :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Password updated successfully!
 *
 * /generate_otp :
 *      post :
 *          tags : [Authentication]
 *          summary : API to send an OTP (One-Time Password) to the registered user email.
 *          security : 
 *                - bearerAuth : []
 *                - credentialAuth : [] 
 *          requestBody :
 *                description : Provide the following details in JSON format to send a OTP (One-Time Password) to the registered user email.
 *                content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/GenerateOtp'
 *                    application/x-www-form-urlencode :
 *                       schema :
 *                           $ref : '#/components/schemas/GenerateOtp'
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/GenerateOtpSuccess'
 *               404 :
 *                  description : Not found
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/InvalidEmail'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 * /verify_otp :
 *      post :
 *          tags : [Authentication]
 *          summary : API to verify the user by using the OTP (One-Time Password) that had been sent to the user email.
 *          security : 
 *                - bearerAuth : []
 *                - credentialAuth : [] 
 *          requestBody :
 *                description : Provide the following details in JSON format to verify the user by using the OTP (One-Time Password) while user is in the forgot password stage.
 *                content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/verifyOtp'
 *                    application/x-www-form-urlencode :
 *                       schema :
 *                           $ref : '#/components/schemas/verifyOtp'
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/VerifySuccess'
 *               400 :
 *                  description : Bad Request
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/InvalidOtp'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 * /forgot_password :
 *      post :
 *          tags : [Authentication]
 *          summary : API to reset the password while user forgot their password.
 *          security : 
 *                - bearerAuth : []
 *                - credentialAuth : [] 
 *          requestBody :
 *                description : Provide the following details in JSON format to reset the password.
 *                content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/PasswordUpdate'
 *                    application/x-www-form-urlencode :
 *                       schema :
 *                           $ref : '#/components/schemas/PasswordUpdate'
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/PasswordUpdateSuccess'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 *
 */

router.post(
	ENDPOINTS.GENERATE_OTP,
	validateRequest([body('email').isEmail().withMessage('Email must be valid')]),
	forgetPasswordController.sendOTP
);

router.post(
	ENDPOINTS.VERIFY_OTP,
	validateRequest([
		body('email').isEmail().withMessage('Email must be valid'),
		body('passwordResetCode').isNumeric().isLength(6).withMessage('Password Reset Code must be valid')
	]),
	forgetPasswordController.validateOTP
);

router.post(
	ENDPOINTS.FORGOT_PASSWORD,
	validateRequest([
        body('email').isEmail().withMessage('Email must be valid'),
        body('newPassword').matches(REGEX.PASSWORD).withMessage('Password must be of 8 characters including 1 uppercase, 1 lowercase, 1 special character(!@#$%^&*) and 1 number')
    ]),
	forgetPasswordController.forgotPassword);

export default router;
