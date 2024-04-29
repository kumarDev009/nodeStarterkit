import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(({ message, timestamp }) => {
	return `${timestamp} - ${message}`;
});

export const errorLogger = createLogger({
	level: 'error',
	transports: [
		new transports.File({
			level: 'error',
			filename: 'error.log',
			format: format.combine(
				format.json(),
				format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				customFormat
			)
		})
	]
});

export const infoLogger = createLogger({
	level: 'info',
	transports: [
		new transports.File({
			level: 'info',
			filename: 'info.log',
			format: format.combine(
				format.json(),
				format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				customFormat
			)
		})
	]
});

export const warnLogger = createLogger({
	level: 'warn',
	transports: [
		new transports.File({
			level: 'warn',
			filename: 'warn.log',
			format: format.combine(
				format.json(),
				format.timestamp({ format: 'MM/DD/YYYY HH:mm:ss' }),
				customFormat
			)
		})
	]
});
