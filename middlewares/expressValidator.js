import { validationResult } from 'express-validator';

// Custom Function to return the error on the api response
// validations contains the array of body(express-validator) which we send as a arguments to this function
export const validateRequest = validations => {
	return async (req, res, next) => {
		// validation.run(req) executes the body to validate the condition which we gave
		await Promise.all(validations.map(validation => validation.run(req)));
		let errResponse;
		// validationResult through the errors, if present in json format. 
		const errors = validationResult(req);
		if (errors.isEmpty()) {
			return next();
		} else {
			// from the below function we create the custom message based on the errors which we got through validationResult function
			errors?.errors?.forEach(item => {
				errResponse = { ...errResponse, message: item.msg };
			});
		}
		return res.status(400).json(errResponse);
	};
};
