import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/jwtToken.js";
import { middlewares } from '../middlewares/jwtToken.js';
import { ENDPOINTS, ERROR_MESSAGE, REGEX, ROLES } from '../utils/constants.js';
import { validateRequest } from "../middlewares/expressValidator.js";
import { customRegexValidator } from "../utils/HelperFunction.js";
import { body, check, param } from "express-validator";

/**
 * @swagger
 * components :
 *      schemas :
 *          UserData :
 *              type : object
 *              properties :
 *                  email :
 *                      type : string
 *                      example: demo@gmail.com
 *                  password :
 *                      type : string
 *                      example: password
 *                  firstName :
 *                      type : string
 *                      example: demo
 *                  lastName :
 *                      type : string
 *                      example: user
 *                  phone :
 *                      type : string
 *                      example: 9876543210
 *                  address1 :
 *                      type : string
 *                      example: 57
 *                  address2 :
 *                      type : string
 *                      example: street name
 *                  city :
 *                      type : string
 *                      example: city1
 *                  state :
 *                      type : string
 *                      example: TamilNadu
 *                  country :
 *                      type : string
 *                      example: IN
 *                  zip_code :
 *                      type : string
 *                      example: 628501
 *                  role :
 *                      type : string
 *                      example: Admin
*          EditUserData :
*              type : object
*              properties :
*                  firstName :
*                      type : string
*                      example: demo
*                  lastName :
*                      type : string
*                      example: user
*                  phone :
*                      type : string
*                      example: 9876543210
*                  dob :
*                      type : string
*                      example: 01/01/2023
*                  address1 :
*                      type : string
*                      example: 57
*                  address2 :
*                      type : string
*                      example: street name
*                  city :
*                      type : string
*                      example: city1
*                  state :
*                      type : string
*                      example: TamilNadu
*                  zip_code :
*                      type : string
*                      example: 628501
 *          ResetPassword :
 *              type : object
 *              required :
 *                  - email
 *                  - oldPassword
 *                  - newPassword
 *              properties :
 *                  email :
 *                      type : string
 *                      example : demo@gmail.com
 *                  oldPassword :
 *                      type : string
 *                      example : password
 *                  newPassword :
 *                      type : string
 *                      example : newPassword
 *          ResetpasswordSuccess :
 *               type : object
 *               properties :
 *                  message :
 *                      type : string
 *                      example : Password updated successfully!
 *          oldPasswordIncorrect :
 *               type : object
 *               properties :
 *                  message :
 *                      type : string
 *                      example : The old password provided is incorrect. Please double-check and try again
 *          InconvienceResponse :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Sorry for the inconvenience
 *          UpdatedSuccessfully :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : User details have been updated successfully
 *          UnAuthorized :
 *               type : object
 *               properties :
 *                  message :
 *                      type : string
 *                      example : Account is not recognized.
 *          UpdateSuccess :
 *               type : object
 *               properties :
 *                  message :
 *                      type : string
 *                      example : User details have been updated successfully.
 *          UpdateUser : 
 *              type : object
 *              required : 
 *                  - first_name
 *                  - last_name
 *              properties : 
 *                  first_name : 
 *                      type : string
 *                      example : Admin
 *                  last_name : 
 *                      type : string
 *                      example : Admin
 *                  phone : 
 *                      type : string
 *                      example : 1234567890
 *                  address1 : 
 *                      type : string
 *                      example : 12
 *                  address2 : 
 *                      type : string
 *                      example : street
 *                  city : 
 *                      type : string
 *                      example : city_name
 *                  state : 
 *                      type : string
 *                      example : state_name
 *                  zip_code : 
 *                      type : string
 *                      example : 123456
 *                  updated_by : 
 *                      type : string
 *                      example : admin
 *          RegisterSuccess :
 *              type: object
 *              properties :
 *                  message:
 *                      type : string
 *                      example : Register Successfully
 *          RegisterUserExist :
 *              type : object
 *              properties :
 *                  message :
 *                      type : string
 *                      example : Email already exists.!!
 *          Register :
 *              type : object
 *              required :
 *                  - email
 *                  - password
 *                  - firstName
 *                  - lastName
 *                  - dob
 *              properties :
 *                  email :
 *                      type : string
 *                      example: demo@gmail.com
 *                  password :
 *                      type : string
 *                      example: P@ssword123
 *                  firstName :
 *                      type : string
 *                      example: demo
 *                  lastName :
 *                      type : string
 *                      example: user
 *                  dob :
 *                      type : date
 *                      example: 1996-07-10
 *          DeletedSuccess : 
 *              type : object
 *              properties : 
 *                  message : 
 *                      type : string
 *                      example : User removed successfully
 *          InvalidId : 
 *              type : object
 *              properties : 
 *                  error : 
 *                      type : string
 *                      example : UserId does not exist
 * /user/get_all_users :
 *      get :
 *          tags : [Users]
 *          summary : API to fetch all user details based on page, page size and search term which are all optional params.
 *          security :
 *                - bearerAuth : []
 *                - credentialAuth : []
 *          parameters :
 *                - name: page
 *                  in: query
 *                  type: string
 *                  description: Provide the following page value to fetch the users list in certain page.
 *                - name: pageSize
 *                  in: query
 *                  description: Provide the following pageSize value to fetch the users list count.
 *                - name: search_terms
 *                  in: query
 *                  description: Provide the following search_terms value to fetch the user details based on this query.
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/UserData'
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
 * /user/get_user_by_id/{id} :
 *      get :
 *          tags : [Users]
 *          summary : API to fetch user details based on user's id.
 *          security :
 *                - bearerAuth : []
 *                - credentialAuth : []
 *          parameters :
 *                - name: id
 *                  in: path
 *                  required: true
 *                  schema :
 *                      type: string
 *                  description: User id is required for user details
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/UserData'
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
 * /user/get_user_by_email/{email} :
 *      get :
 *          tags : [Users]
 *          summary : API to get a specific user details by email
 *          security :
 *                - bearerAuth : []
 *          parameters :
 *                - name: email
 *                  in: path
 *                  required: true
 *                  schema :
 *                      type: string
 *                  description: User email is required for user details
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/UserData'
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
 *                           $ref : '#/components/schemas/InconvienceResponse'
 * /user/reset_password :
 *      post :
 *          tags : [Users]
 *          summary : API to reset a user's password by providing their old password and a new password.
 *          description : Allow a user to reset their password
 *          requestBody :
 *                description : Reqbody contains the email, oldPassword and newPassword in json format
 *                content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/ResetPassword'
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/ResetpasswordSuccess'
 *               404 :
 *                  description : Not Found
 *                  content :
 *                      application/json :
 *                          schema :
 *                              $ref : '#/components/schemas/oldPasswordIncorrect'
 *               401 :
 *                  description : Unauthorized
 *                  content :
 *                      application/json :
 *                          schema :
 *                              $ref : '#/components/schemas/UnAuthorized'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 * /user/register :
 *      post :
 *          tags : [Users]
 *          summary : Use this endpoint to allow users to register by providing their basic information.
 *          security :
 *                - bearerAuth : []
 *                - credentialAuth : []
 *          requestBody :
 *               description : Provide the following details in JSON format to allow the user to register.
 *               content :
 *                   application/json :
 *                      schema :
 *                          $ref : '#/components/schemas/Register'
 *          responses :
 *               201 :
 *                  description : Created
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/RegisterSuccess'
 *               400 :
 *                  description : Bad request
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/RegisterUserExist'
 *               500 :
 *                  description : Internal error
 *                  content :
 *                      application/json :
 *                          schema :
 *                               $ref : '#/components/schemas/InconvienceResponse'
 * /user/update_user/{id} :
 *      put :
 *          tags : [Users]
 *          summary : API to update a specific user details based on id
 *          security :
 *                - bearerAuth : []
 *                - credentialAuth : []
 *          parameters :
 *                - name: id
 *                  in: path
 *                  required: true
 *                  schema :
 *                      type: string
 *                  description: User Id is required for update the user details
 *          requestBody :
 *               description : Provide the following details in JSON format to update the user details.
 *               content :
 *                   application/json :
 *                      schema :
 *                          $ref : '#/components/schemas/UpdateUser'
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/UpdateSuccess'
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
 *                           $ref : '#/components/schemas/InconvienceResponse'
 * /user/deleteuser/{id} :
 *      delete :
 *          tags : [Users]
 *          summary : API to delete a specific user details based on id
 *          security :
 *                - bearerAuth : []
 *                - credentialAuth : []
 *          parameters :
 *                - name: id
 *                  in: path
 *                  required: true
 *                  schema :
 *                      type: string
 *                  description: User id is required to delete the user details
 *          responses :
 *               200 :
 *                  description : Ok
 *                  content :
 *                    application/json :
 *                       schema :
 *                           $ref : '#/components/schemas/DeletedSuccess'
 *               400 : 
 *                  description : Bad Request
 *                  content : 
 *                    application/json : 
 *                       schema : 
 *                           $ref : '#/components/schemas/InvalidId'
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
 *                           $ref : '#/components/schemas/InconvienceResponse'
 */

const router = express.Router();

const addressValidation = (value, req) => {
	if (value) {
        return ( req.body.address1?.trim().length > 0
            || req.body.address2?.trim().length > 0 )
            && req.body.city?.trim().length > 0
            && req.body.country?.trim().length > 0
            && req.body.state?.trim().length > 0;
	}
	return true;
};

router.get(
    ENDPOINTS.GET_USER_BY_ID,
    validateRequest([
        param('id').isAscii().withMessage(ERROR_MESSAGE.USER_ID_REQUIRED),
    ]),
    authenticateJWT,
    userController.getUserById
);

router.get(
    ENDPOINTS.GET_USER_BY_EMAIL,
    validateRequest([
        param('email').isEmail().withMessage(ERROR_MESSAGE.VALID_EMAIL),
    ]),
    authenticateJWT,
    userController.getUserByEmail
);

router.put(
    ENDPOINTS.UPDATE_USER,
    validateRequest([
        param('id').isAscii().withMessage(ERROR_MESSAGE.USER_ID_REQUIRED),
        check('firstName')
            .if(body('firstName').exists()) // check subfield only if 'firstName' exist
            .notEmpty().withMessage(ERROR_MESSAGE.FIRST_NAME_REQUIRED),
        check('lastName')
            .if(body('lastName').exists()) // check subfield only if 'lastName' exist
            .notEmpty().withMessage(ERROR_MESSAGE.LAST_NAME_REQUIRED),
        check('dob')
            .if(body('dob').exists())  // check subfield only if 'dob' exist
            .notEmpty().withMessage(ERROR_MESSAGE.LAST_NAME_REQUIRED),
    ]),
    authenticateJWT,
    userController.updateUser
);

router.get(
    ENDPOINTS.GET_ALL_USERS,
    middlewares([ROLES.ADMIN]),
    userController.getAllUsers
);

router.delete(
    ENDPOINTS.DELETE_USER,
    authenticateJWT,
    userController.deleteUser
);

router.post(
	ENDPOINTS.REGISTER,
	validateRequest([
		body('firstName').isAlphanumeric().withMessage('Firstname must be valid'),
		body('lastName').isAlphanumeric().withMessage('Lastname must be valid'),
		body('email').isEmail().withMessage('Email must be valid'),
		body('password').matches(REGEX.PASSWORD).withMessage('Password must be of 8 characters including 1 uppercase, 1 lowercase, 1 special character(!@#$%^&*) and 1 number'),
		body('dob').isDate({format: 'YYYY-MM-DD'}).withMessage('Invalid date format for DOB')
	]),
	userController.register
);

router.post(
	ENDPOINTS.RESET_PASSWORD,
    authenticateJWT,
    validateRequest([
        body('email').isEmail().withMessage('Email must be valid'),
        body('newPassword').matches(REGEX.PASSWORD).withMessage('Password must be of 8 characters including 1 uppercase, 1 lowercase, 1 special character(!@#$%^&*) and 1 number')
    ]),
    userController.resetPassword
)

export default router;
