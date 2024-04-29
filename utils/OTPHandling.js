import { getOTPQuery } from '../models/forgetPassword.model.js';

// Used to generate OTP
export const generateOTP = () => {
	const OTP = Math.floor(100000 + Math.random() * 900000); // Logic for generate random 6 digit OTP
	return OTP;
};

export const isValidOtp = async (email, otp) => {
    const response = await getOTPQuery(email)
    if (!response.rows[0]?.length && response.rows[0].verification_code !== otp) return false
    return true
}

// Used to verify if the OTP is expired or not
export const isOTPExpired = async (email) => {
    const response = await getOTPQuery(email)
    const passwordResetExpiry = response.rows[0].verification_code_expiry
    const otpExpirationTime = 15 * 60 * 1000 // Logic for calculate OTP expiration time
    if (Date.now() - passwordResetExpiry < otpExpirationTime) return true
    return false
}
