import pkg from 'pg';
import { db_config } from '../config/index.js';
import { createTbl } from '../pgHelper/schema.js';
import {
	rolesTabInitData,
	countriesTabInitData,
	statusesTabInitData,
	usersTabInitData
} from './lookupData.js';

const { Pool } = pkg;

const dbConfig = db_config.db;

(async () => {
	const dbClient = new Pool({
		host: dbConfig.host,
		user: dbConfig.user,
		password: dbConfig.password,
		port: dbConfig.port,
		database: 'postgres'
	});

	const res = await dbClient.query(
		`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${dbConfig.database}'`
	);

	// Database and Table creation
	if (res.rowCount === 0) {
		console.log(`${dbConfig.database} database not found, creating it.`);

		const result = await dbClient.query(
			`CREATE DATABASE "${dbConfig.database}";`
		);

		console.log(`Database ${dbConfig.database} created successfully`);

		if (result.command === 'CREATE') {
			const dbConn = new Pool({
				host: dbConfig.host,
				user: dbConfig.user,
				password: dbConfig.password,
				database: dbConfig.database,
				port: dbConfig.port
			});

			await dbConn.query(createTbl); //Table Creation

			console.log('All the tables are created successfully');

			// Initial data insertion
			const isRolesData = await dbConn.query('SELECT * FROM roles');
			const isCountriesData = await dbConn.query('SELECT * FROM countries');
			const isStatuesesData = await dbConn.query('SELECT * FROM statuses');
			const isUsersData = await dbConn.query('SELECT * FROM users');
			await dbConn.query('CREATE EXTENSION pgcrypto;');
			if (isRolesData.rowCount === 0) {
				await dbConn.query(rolesTabInitData);
				console.log('Roles table initial data inserted successfully');
			} else {
				console.log('Roles table initial data already exists');
			}

			if (isCountriesData.rowCount === 0) {
				await dbConn.query(countriesTabInitData);
				console.log('Countries table initial data inserted successfully');
			} else {
				console.log('Countries table initial data already exists');
			}

			if (isStatuesesData.rowCount === 0) {
				await dbConn.query(statusesTabInitData);
				console.log('Statuses table initial data inserted successfully');
			} else {
				console.log('Statuses table initial data already exists');
			}

			if (isUsersData.rowCount === 0) {
				await dbConn.query(usersTabInitData);
				console.log('Users table initial data inserted successfully');
			} else {
				console.log('Users table initial data already exists');
			}
		}
	} else {
		console.log(`${dbConfig.database} database and tables are exists.`);
		console.log('Table lookup data already exists');
	}
	await dbClient.end();
})();

const dbClient = () => {
	const dbClient = new Pool({
		host: dbConfig.host,
		user: dbConfig.user,
		password: dbConfig.password,
		database: dbConfig.database,
		port: dbConfig.port
	});

	return dbClient;
};

export default dbClient;
