import express from 'express';
import cors from 'cors';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import session from 'express-session';
import dotenv from 'dotenv';
dotenv.config();

import { port } from './config/index.js';
import router from './routes/index.js';
import { swaggerOptions } from './swagger/swagger.js';
import passport from './middlewares/passport.js';

var options = {
	explorer: true
};

const swaggerSpec = swaggerJsdoc(swaggerOptions, options);

const app = express();

// parsing the POST data to req.body
app.use(express.json()); // parse the content-type application/JSON
app.use(express.urlencoded({ extended: true })); // parse the content-type application/x-www-form-urlencoded
// extended true will use qs and allow nested object data. false will use query-string and not supports nested object.

app.use(cors());

app.use(session({ secret: process.env.SESSION_SECRET }));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// app.use(passport.initialize())

app.use('/api', router); // this will call for all the requests

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port.port, async () => {
	try {
		console.log(`server running on port ${port.port}!`);
	} catch (error) {
		console.log('app.listen error', error);
	}
});
