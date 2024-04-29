import { ERROR_MESSAGE, STATUS } from '../utils/constants.js';

export const successHandler = (statusCode, res, customMessage) => {

	const handleResponse = (message) => {
		if (customMessage) return res.status(statusCode).json(customMessage);
		return res.status(statusCode).json(message.TEXT);
	};

	switch (statusCode) {
	case 200:
		return handleResponse(STATUS.SUCCESS);
	case 201:
		return handleResponse(STATUS.CREATED);
	default:
		return handleResponse({ TEXT: ERROR_MESSAGE.WENT_WRONG });
	}
};
