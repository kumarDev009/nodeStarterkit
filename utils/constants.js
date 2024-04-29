export const ENDPOINTS = {
	LOGIN: '/login',
	REGISTER: '/register',
	VERIFY_USER: '/verify_user',
	GENERATE_OTP: '/generate_otp',
	VERIFY_OTP: '/verify_otp',
	FORGOT_PASSWORD: '/forgot_password',
	UPDATE_USER: '/update_user/:id',
	RESET_PASSWORD: '/reset_password',
	GET_USER_BY_ID: '/get_user_by_id/:id',
	GET_USER_BY_EMAIL: '/get_user_by_email/:email',
	GET_ALL_USERS: '/get_all_users',
	DELETE_USER: '/deleteuser/:id',
	GET_COUNTRIES: '/get_countries',
	GET_ROLES: '/get_roles',
	GET_STATUS: '/get_statuses'
};

export const ROLES = {
	ADMIN: 'Admin',
	USER: 'User'
};

export const STATUS = {
	SUCCESS: {
		CODE: 200,
		TEXT: 'Success'
	},
	CREATED: {
		CODE: 201,
		TEXT: 'Created'
	},
	ACCEPTED: {
		CODE: 202,
		TEXT: 'Accepted'
	},
	NO_CONTENT: {
		CODE: 204,
		TEXT: 'No content'
	},
	RESET: {
		CODE: 205,
		TEXT: 'Reset'
	},
	PARTIAL_CONTENT: {
		CODE: 206,
		TEXT: 'Partial content'
	},
	BAD_REQUEST: {
		CODE: 400,
		TEXT: 'Bad request'
	},
	NOT_AUTHENTICATED: {
		CODE: 401,
		TEXT: 'Invalid or Missing Credentials'
	},
	NOT_AUTHORIZED: {
		CODE: 403,
		TEXT: 'Not authorized'
	},
	NOT_FOUND: {
		CODE: 404,
		TEXT: 'Not found'
	},
	NOT_ALLOWED: {
		CODE: 405,
		TEXT: 'Not allowed'
	},
	NOT_ACCEPTABLE: {
		CODE: 406,
		TEXT: 'Not acceptable'
	},
	CONFLICTS: {
		CODE: 409,
		TEXT: 'Conflicts'
	},
	EXPECTATION_FAILED: {
		CODE: 417,
		TEXT: 'Expectation failed'
	},
	TOO_MANY_REQUESTS: {
		CODE: 429,
		TEXT: 'Too many requests'
	},
	INTERNAL_ERROR: {
		CODE: 500,
		TEXT: 'Internal error'
	},
	NOT_IMPLEMENTED: {
		CODE: 501,
		TEXT: 'Not implemented'
	},

	// API specific custom error codes
	DB_NOT_AVAILABLE: {
		CODE: 801,
		TEXT: 'DB not available'
	},
	DSN_NOT_AVAILABLE: {
		CODE: 802,
		TEXT: 'DSN not available'
	}
};

export const ERROR_MESSAGE = {
	WENT_WRONG: 'Something went wrong',
	EMAIL_EXIST: 'Email already exists!',
	VALID_EMAIL: 'Please enter a valid email',
	INVALID_OTP: 'Invalid verification code',
	OTP_EXPIRED: 'Verification code has expired',
	ACCOUNT_NOT_RECOGNIZED: 'Account is not recognized',
	INCORRECT_PASSWORD: 'Password is incorrect.',
	USER_NOT_FOUND: 'User not found',
	USER_ROLE_NOT_FOUND: 'User role not found',
	ROLE_NOT_PROVIDE_TO_MIDDLEWARE: 'User role is not provided to middleware',
	NAMES_ARE_REQUIRED: 'Names are required',
	ID_REQUIRED: 'Id is required',
	USER_ID_REQUIRED: 'User id is required',
	USER_EMAIL_REQUIRED: 'User email is required',
	USER_NOT_AUTHORIZED: 'User is not authorized for this action',
	USER_ID_NOT_EXIST: 'UserId does not exist',
	NAMES_ARE_REQUIRED: 'First name and last name are required',
	FIRST_NAME_REQUIRED: 'First name is required',
	LAST_NAME_REQUIRED: 'Last name is required',
	USER_ID_REQUIRED: "User id is required",
	USER_EMAIL_REQUIRED: "User email is required",
	USER_NOT_AUTHORIZED: 'User is not authorized for this action',
	VALID_ADDRESS : 'Please enter the valid address',
	INVALID_TOKEN: 'Invalid token',
	OLD_PASSWORD_INCORRECT: 'The old password provided is incorrect. Please double-check and try again'
};

export const SUCCESS_MESSAGE = {
	LOGIN_SUCCESS: 'Login success',
	REGISTER_SUCCESS: 'Register successfully',
	USER_VERIFICATION: 'Your account has been verified!',
	PASSWORD_CHANGE_MSG: 'You can change your password now!',
	FORGOT_PASSWORD: 'Password updated successfully!',
	OTP_SUCCESS: 'OTP send successfully',
	VERIFY_OTP_CODE: 'verify_otp',
	REMOVE_USER: 'User removed successfully',
	RESET_PASSWORD: 'Password reset successfully',
	GET_COUNTRIES_DATA_SUCCESS: 'Countries details are retrieved successfully',
	GET_ROLES_DATA_SUCCESS: 'Roles details are retrieved successfully',
	GET_STATUS_SUCCESS: 'Statuses are retrieved successfully',
	USER_DETAILS_UPDATE: 'User details have been updated successfully'
};
export const DEFAULT_PARAMETERS = {
	PAGE: 1,
	PAGE_SIZE: 10
};

export const RESPONSE_CODE = {
	VERIFY_OTP_CODE: 'verify_otp'
}

export const DB_NAME = 'node_starter_kit';

export const REGEX = {
	// password must contains min 8	characters including 1 uppercase 1 lowercase 1 special character and 1 number
	PASSWORD: `^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$`,
	// pincode must be 5 to 10 character and if we use hyphen we need to give 5 characters for both side
	PINCODE: `^(?:[A-Za-z0-9]{5,10}(?:-[A-Za-z0-9]{4})?)?$`
};
