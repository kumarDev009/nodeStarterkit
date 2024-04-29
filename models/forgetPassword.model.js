import dbClient from '../pgHelper/index.js';

export const updateOTP = async (data) => {
    const response = await dbClient().query("UPDATE users SET verification_code = $1, verification_code_expiry = NOW() WHERE email = $2",[data.otp,data.email])
    return response
}

export const resetOTP = async (email)=>{
    const response = await dbClient().query("UPDATE users SET verification_code = $1, verification_code_expiry = $2 WHERE email = $3",[null,null,email])
}

export const getOTPQuery = async email => {
	const response = await dbClient().query(
		'SELECT * FROM users WHERE email = $1;',
		[email]
	);
	return response;
};

export const updatePwdQuery = async data => {
	const result = await dbClient().query(
		'UPDATE users SET password_hash = $1 WHERE email = $2',
		[data.password_hash, data.email]
	);
	return result;
};
