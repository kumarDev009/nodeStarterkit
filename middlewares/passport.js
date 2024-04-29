import passport from 'passport';
import { ComparePassword } from './passwordHasing.js';
import dbClient from '../pgHelper/index.js';
import LocalStrategy from 'passport-local';
import { ERROR_MESSAGE } from '../utils/constants.js';

const customFields = {
	usernameField: 'email',
	passwordField: 'password'
};

const verifyCallback = async (email, password, done) => {
	dbClient().query(
		'SELECT * FROM users WHERE email=$1',
		[email],
		async function (error, results) {
			if (error) {
				console.log('query error: ' + error);
				return done(error);
			}
			if (results.rowCount == 0) {
				return done(null, false, { message: ERROR_MESSAGE.ACCOUNT_NOT_RECOGNIZED });
			}

			const isValid = await ComparePassword(
				password,
				results.rows[0].password_hash
			);
			const user = {
				id: results.rows[0].id,
				email: results.rows[0].email,
				firstName: results.rows[0].first_name,
				lastName: results.rows[0].last_name,
				role: results.rows[0].role,
				status: results.rows[0].status
			};

			if (isValid) {
				return await done(null, user);
			} else {
				return done(null, false, { message: ERROR_MESSAGE.INCORRECT_PASSWORD });
			}
		}
	);
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

export default passport;
