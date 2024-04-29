const handleAPIRoutes = () => {
	let routePattern;
	if (process.env.NODE_ENV === 'production') {
		routePattern = '../routes/*.js'; // Production route pattern
	} else {
		routePattern = './routes/*.js'; // Development route pattern
	}

	return routePattern;
};

export const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Starter Kit',
			version: '1.0.0',
			description: `Welcome to the Starter Kit API documentation. This API provides various endpoints to help you get started with your project. Explore the endpoints below to understand how to interact with the API and build your applications.`
		},
		servers: [
			{
				url: 'http://api.starter.kit.mitrahsoft.co.in/api'
			}
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					in: 'header',
					name: 'Authorization',
					description: 'Bearer Token',
					scheme: 'bearer',
					bearerFormat: 'JWT'
				},
				credentialAuth: {
					type: 'http',
					in: 'header',
					scheme: 'basic'
				}
			}
		}
	},

	// files containing annotations as above
	apis: [handleAPIRoutes()]
};
