import { ERROR_MESSAGE, STATUS } from '../utils/constants.js';

export const errorHandler = (statusCode, res, customMessage) => {
	const handleResponse = message => {
		if (customMessage) return res.status(statusCode).json(customMessage);
		return res.status(statusCode).json({ message: message.TEXT });
	};

	switch (statusCode) {
	case 400:
		return handleResponse(STATUS.BAD_REQUEST);
	case 401:
		return handleResponse(STATUS.NOT_AUTHENTICATED);
	case 403:
		return handleResponse(STATUS.NOT_AUTHORIZED);
	case 404:
		return handleResponse(STATUS.NOT_FOUND);
	case 409:
		return handleResponse(STATUS.CONFLICTS);
	case 417:
		return handleResponse(STATUS.EXPECTATION_FAILED);
	case 500:
		return handleResponse(STATUS.INTERNAL_ERROR);
	case 501:
		return handleResponse(STATUS.NOT_IMPLEMENTED);
	default:
		return handleResponse({ TEXT: ERROR_MESSAGE.WENT_WRONG });
	}
};
