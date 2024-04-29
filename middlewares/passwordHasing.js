import * as bcrypt from 'bcrypt';
import dbClient from '../pgHelper/index.js';

// Function for password decryption
export async function hashPassword(plaintextPassword) {
	const hash = await bcrypt.hash(plaintextPassword, 10);
	return hash;
	// Store hash in the database
}

// Function for password encryption
export async function ComparePassword(plaintextPassword, hash) {
	const result = await bcrypt.compare(plaintextPassword, hash);
	return result;
}

export const emailExists = async email => {
	const data = await dbClient().query('SELECT * FROM users WHERE email=$1', [
		email
	]);
	if (data.rowCount == 0) return false;
	return data.rows[0];
};
