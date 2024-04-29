import dotenv from 'dotenv';
dotenv.config();

import { DB_NAME } from '../utils/constants.js';

export const port = {
	port: process.env.PORT || 8000
};

export const jwtConfig = {
	jwtsecret: process.env.JWT_SECRET
};

export const db_config = {
	db: {
		host: process.env.HOST,
		database: DB_NAME,
		user: process.env.PG_USERNAME,
		password: process.env.PG_PASSWORD,
		port: 5432
		// port: process.env.PG_PORT || 5432,
	}
};
