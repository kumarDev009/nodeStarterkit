1. **Project Structure:**
   - Organize your project into directories like `controllers`, `routes`, `models`, `middlewares`, and `config`.
   - Create separate files for each module, route, and configuration.
   - Use a consistent naming convention for your files and folders.

2. **Modularization and Route Handling:**
   - Break down your application into smaller, reusable modules.
   - Use a modular approach with separate files for routes and controllers.
   - Create individual files for each route in the `routes` directory.
   - Keep route handlers and business logic separate in the `controllers` directory.
   - Utilize middleware for route-specific and global functionality.

3. **Database Interaction:**
   - Define models for your database tables in the `models` directory.
   - Keep raw SQL queries abstracted within your model functions.
   - Avoid executing raw SQL queries directly in route handlers.

4. **Error Handling:**
   - Use try-catch blocks or middleware for handling errors in asynchronous code.

      Example:

      ```javascript
      async function fetchDataFromAPI() {
          try {
              const response = await fetch('https://api.example.com/data');
              const data = await response.json();
              return data;
          } catch (error) {
              console.error('An error occurred:', error);
              throw new Error('Failed to fetch data from API');
          }
      }
      ```

      In this example, we're using a try-catch block to handle potential errors that may occur while fetching data from an API.

   - Create custom error classes or use existing HTTP error classes like BadRequest, NotFound, etc.

      Example:

      ```javascript
      class DatabaseError extends Error {
          constructor(message) {
              super(message);
              this.name = 'DatabaseError';
          }
      }
      
      function fetchUserDataFromDatabase(userId) {
          if (userId === null) {
              throw new DatabaseError('Invalid user ID');
          }
          // ...fetch and return user data
      }
      ```

      Here, we've created a custom `DatabaseError` class that extends the built-in `Error` class. This allows us to create specific error types for different scenarios.

   - Use a centralized error-handling middleware to catch and handle errors.

      Example:

      ```javascript
      app.use((err, req, res, next) => {
          console.error('An error occurred:', err);
      
          if (err instanceof DatabaseError) {
              return res.status(500).json({ error: 'Database error' });
          }
      
          if (err instanceof NotFound) {
              return res.status(404).json({ error: 'Resource not found' });
          }
      
          // Handle other types of errors...
      
          res.status(500).json({ error: 'Internal server error' });
      });
      ```

      In this example, we're using centralized error-handling middleware in an Express.js application. The middleware catches different types of errors, such as `DatabaseError` and `NotFound`, and responds with appropriate error messages and status codes.

5. **Validation and Sanitization:**
   - Utilize the `express-validator` library for request data validation and sanitization.

        Example:

        ```javascript
        const express = require('express');
        const { body, validationResult } = require('express-validator');

        const app = express();

        // Example route handler using express-validator for data validation and sanitization
        app.post('/user', [
            body('username').isLength({ min: 5 }).trim().escape(),
            body('email').isEmail().normalizeEmail(),
            body('age').isInt({ min: 18, max: 99 }),
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            // Process validated and sanitized data
            // ...
        });

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
        ```

    - Validate incoming data before processing it in route handlers.

        Example:

        ```javascript
        // Example route handler with data validation
        app.post('/post', [
            body('title').notEmpty().isString().trim(),
            body('content').notEmpty().isString(),
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            // Process validated data
            const { title, content } = req.body;
            // ...
        });

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
        ```

    - Sanitize user inputs to prevent security vulnerabilities (e.g., SQL injection, XSS attacks).

        Example:

        ```javascript
        // Example route handler with data sanitization
        app.post('/search', [
            body('query').isString().trim().escape(),
        ], (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
            }

            // Process sanitized data
            const { query } = req.body;
            // Perform safe database query or other operations
            // ...
        });

        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
        ```

6. **Security with Helmet:**
   - Use the `helmet` middleware to enhance security by setting HTTP headers.

        Example:

        ```javascript
        const express = require('express');
        const helmet = require('helmet');

        const app = express();

        // Use helmet middleware
        app.use(helmet());
        ```

   - Implement security headers like `Content-Security-Policy`, `X-XSS-Protection`, `X-Content-Type-Options`, etc.

        Example:

        - `Content-Security-Policy`:

        ```javascript
        app.use(
        helmet.contentSecurityPolicy({
            directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'trusted-cdn.com'],
            styleSrc: ["'self'", 'maxcdn.bootstrapcdn.com'],
            // ...other directives
            },
        })
        );
        ```

        - `X-XSS-Protection`:

        ```javascript
        app.use(helmet.xssFilter());
        ```

        - `X-Content-Type-Options`:

        ```javascript
        app.use(helmet.noSniff());
        ```

7. **API Documentation with Swagger:**
   - Use the `swagger-jsdoc` and `swagger-ui-express` libraries to generate API documentation.

        Example:

        ```javascript
        const express = require('express');
        const swaggerJSDoc = require('swagger-jsdoc');
        const swaggerUI = require('swagger-ui-express');

        const app = express();

        // Swagger setup
        const swaggerOptions = {
        definition: {
            openapi: '3.0.0',
            info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API documentation using Swagger',
            },
            servers: [
            {
                url: 'http://localhost:3000',
            },
            ],
        },
        apis: ['./routes/*.js'], // Path to the files containing Swagger annotations
        };

        const swaggerSpec = swaggerJSDoc(swaggerOptions);

        app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

        // ... Define your route handlers and other middleware here

        app.listen(3000, () => {
        console.log('Server is running on port 3000');
        });
        ```

    - Annotate your route handlers with Swagger comments to automatically generate API documentation.

        Example:

        In your route handler files, annotate your API routes and methods using Swagger comments. These comments will be used by `swagger-jsdoc` to generate API documentation.

        ```javascript
        /**
         * @swagger
        * /users:
        *   get:
        *     summary: Get a list of users
        *     description: Retrieves a list of users.
        *     responses:
        *       200:
        *         description: Successful response with a list of users.
        *         content:
        *           application/json:
        *             example:
        *               - id: 1
        *                 name: John Doe
        *               - id: 2
        *                 name: Jane Smith
        */
        app.get('/users', (req, res) => {
        // Handle the request and send back a list of users
        });

        /**
         * @swagger
        * /users/{id}:
        *   get:
        *     summary: Get user by ID
        *     description: Retrieves a user by their ID.
        *     parameters:
        *       - name: id
        *         in: path
        *         required: true
        *         schema:
        *           type: integer
        *         description: ID of the user to retrieve.
        *     responses:
        *       200:
        *         description: Successful response with the user details.
        *         content:
        *           application/json:
        *             example:
        *               id: 1
        *               name: John Doe
        */
        app.get('/users/:id', (req, res) => {
        // Handle the request and send back the user details
        });

        // ... Define more route handlers with Swagger comments
        ```

8. **Logging:**
   - Employ a logging library like `winston` for detailed logging, including errors and application events.

   - Log important information, warnings, and errors for debugging and monitoring.

       Example:

       Set up a logger with the appropriate configuration, such as log file location, log format, and log levels:

       ```javascript
       const winston = require('winston');
       const logger = winston.createLogger({
           level: 'info', // Minimum level to log (info, warn, error)
           format: winston.format.combine(
           winston.format.timestamp(),
           winston.format.printf(({ timestamp, level, message }) => {
               return `[${timestamp}] ${level}: ${message}`;
           })
           ),
           transports: [
           new winston.transports.Console(), // Log to console
           new winston.transports.File({ filename: 'app.log' }) // Log to a file
           ]
       });
       ```

       Now you can use the `logger` object to log messages throughout your application:

       ```javascript
       // Log an information message
       logger.info('Application started');
      
       // Log a warning message
       logger.warn('Database connection lost');
      
       // Log an error message
       logger.error('Critical error occurred', { error: 'Something went wrong' });
       ```

       When logging errors or important events, include additional information that could help in debugging:

       ```javascript
       try {
           // Some code that might throw an error
       } catch (error) {
           logger.error('An error occurred', { error: error.message, stack: error.stack });
       }
       ```

       You can set up different log files for different severity levels to make it easier to analyze and monitor issues:

       ```javascript
       const logger = winston.createLogger({
           level: 'info',
           format: ...
           transports: [
           new winston.transports.Console(),
           new winston.transports.File({ filename: 'info.log', level: 'info' }), // Log info messages to a separate file
           new winston.transports.File({ filename: 'error.log', level: 'error' }) // Log error messages to a separate file
           ]
       });
       ```

       Integrate with middleware or error handling

       ```javascript
       app.use((req, res, next) => {
           logger.info(`Request: ${req.method} ${req.url}`);
           next();
       });
      
       app.use((err, req, res, next) => {
           logger.error('An error occurred during request', { error: err.message, stack: err.stack });
           res.status(500).send('Something went wrong');
       });
       ```

9. **Environment Configuration:**
   - Store configuration variables in environment variables using packages like `dotenv`.

        Example:

        Sample `.env` file:

        ```
        PORT=3000
        DB_HOST=localhost
        DB_USER=myuser
        DB_PASS=mypassword
        ```

        In your main application file (e.g., `app.js` or `index.js`), load the environment variables using `dotenv`:

        ```javascript
        require('dotenv').config();

        const express = require('express');
        const app = express();

        const port = process.env.PORT || 3000;
        const dbHost = process.env.DB_HOST;
        const dbUser = process.env.DB_USER;
        const dbPass = process.env.DB_PASS;

        // Use the configuration variables as needed
        // ...

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}`);
        });
        ```

    - Maintain separate configuration files for different environments (`development`, `production`, `test`).

        Example:

        Create separate configuration files for each environment in a `config` directory within your project. For example, you can have files named `development.js`, `production.js`, and `test.js`.

        Sample `config/development.js`:

        ```javascript
        module.exports = {
            database: {
            host: 'localhost',
            user: 'devuser',
            password: 'devpassword'
            },
            logLevel: 'debug'
        };
        ```

        Sample `config/production.js`:

        ```javascript
        module.exports = {
            database: {
            host: 'productiondb.example.com',
            user: 'produser',
            password: 'prodpassword'
            },
            logLevel: 'info'
        };
        ```

        Sample `config/test.js`:

        ```javascript
        module.exports = {
            database: {
            host: 'testdb.example.com',
            user: 'testuser',
            password: 'testpassword'
            },
            logLevel: 'error'
        };
        ```

        In your main application file, based on the environment (usually set using the `NODE_ENV` environment variable), load the appropriate configuration file:

        ```javascript
        const express = require('express');
        const app = express();
        const config = require('./config/' + (process.env.NODE_ENV || 'development'));

        // Use the configuration variables as needed
        // ...

        app.listen(config.port, () => {
            console.log(`Server is listening on port ${config.port}`);
        });
        ```

10. **Security Best Practices:**
    - Implement user authentication and authorization using libraries like `passport`.

        Example:

        ```javascript
        const express = require('express');
        const passport = require('passport');
        const LocalStrategy = require('passport-local').Strategy;

        const app = express();

        // Set up session and passport middleware
        app.use(require('express-session')({ secret: 'secret-key', resave: false, saveUninitialized: false }));
        app.use(passport.initialize());
        app.use(passport.session());

        // Configure Passport to use a local strategy for authentication
        passport.use(new LocalStrategy(
            (username, password, done) => {
            // Replace this with actual user lookup logic (e.g., database query)
            User.findOne({ username: username }, (err, user) => {
                if (err) return done(err);
                if (!user) return done(null, false, { message: 'Incorrect username.' });
                if (!user.validPassword(password)) return done(null, false, { message: 'Incorrect password.' });
                return done(null, user);
            });
            }
        ));

        // Serialize and deserialize user
        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser((id, done) => {
            // Replace this with actual user lookup logic (e.g., database query)
            User.findById(id, (err, user) => {
            done(err, user);
            });
        });

        // Routes for authentication
        app.post('/login', passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/login',
            failureFlash: true
        }));

        app.get('/logout', (req, res) => {
            req.logout();
            res.redirect('/');
        });
        ```

    - Use HTTPS for secure communication between clients and the server.

        Example:

        To enable HTTPS in your Express app, you need to generate or obtain SSL certificates. Here's how you can set up HTTPS using self-signed certificates for development:

        ```javascript
        const https = require('https');
        const fs = require('fs');

        const options = {
            key: fs.readFileSync('path/to/private-key.pem'),
            cert: fs.readFileSync('path/to/certificate.pem')
        };

        const app = express();

        const server = https.createServer(options, app);

        server.listen(443, () => {
            console.log('Server listening on port 443 (HTTPS)');
        });
        ```

11. **Code Style and Linting:**
    - Use `camelCase` for variable names.
    - Use nouns or noun phrases to describe variables.

       Example:

       ```javascript
       // Good
       const userName = 'johnDoe';
       const itemCount = 10;
       const customerList = [...];
   
       // Avoid
       const UserName = 'johnDoe';
       const user_name = 'johnDoe';
       const uNm = 'johnDoe';
       ```

    - Use verbs or verb phrases to describe function actions.

       Example:

       ```javascript
       // Good
       function getUserData(userId) {
          // ...
       }
   
       function calculateTotalPrice(items) {
          // ...
       }
   
       // Avoid
       function userData(userId) {
          // ...
       }
   
       function total(items) {
          // ...
       }
       ```

    - Use a linter like ESLint to enforce consistent coding style and catch errors.
    - Configure your linter to enforce the naming conventions mentioned above.

       Example `.eslintrc.js` configuration:

       ```javascript
       module.exports = {
          // ... other configurations ...
          rules: {
              // Enforce camelCase for variable names
              'camelcase': 'error',
              // Enforce using nouns for variable names and verbs for function names
              'id-length': ['error', { 'min': 2, 'exceptions': ['i', 'j', 'x', 'y'] }],
              'func-names': 'error',
              'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
          },
       };
       ```

    - Provide meaningful comments and documentation to explain the purpose and usage of variables and functions.

       Example:

       ```javascript
       // Good
       /**
       * Get user data by user ID.
       * @param {string} userId - The ID of the user.
       * @returns {object} User data.
       */
       function getUserData(userId) {
          // ...
       }
   
       // Avoid
       // Function to get user info
       function getInfo(id) {
          // ...
       }
       ```

    - Consistency is key. Maintain the chosen naming conventions throughout your codebase.

12. **Async/Await and Promises:**
    - Use async/await for handling asynchronous operations.

        Example:

        ```javascript
        const express = require('express');
        const app = express();
        const db = require('./db'); // Assume you have a database module

        app.get('/users/:id', async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await db.getUserById(userId); // Using async/await here
            res.json(user);
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        });

        app.listen(3000, () => {
        console.log('Server is running on port 3000');
        });
        ```

    - Promisify callback-based functions using utility libraries like util.promisify.

        Example:

        When working with third-party libraries or modules that provide callback-style functions, you can use `util.promisify` to convert them into promise-based functions. Here's an example of using `util.promisify` with the `fs` module:

        ```javascript
        const util = require('util');
        const fs = require('fs');
        const readFileAsync = util.promisify(fs.readFile);

        app.get('/file/:filename', async (req, res) => {
        try {
            const filename = req.params.filename;
            const data = await readFileAsync(filename, 'utf8'); // Using util.promisify here
            res.send(data);
        } catch (error) {
            console.error('Error reading file:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        });
        ```

13. **Documentation:**
    - Comment your code comprehensively, explaining complex logic and decisions.

       Example:

       ```javascript
       /**
        * Calculates the discounted price for a given item based on the discount percentage.
        *
        * @param {number} originalPrice - The original price of the item.
        * @param {number} discountPercentage - The discount percentage to be applied.
        * @returns {number} Discounted price.
        */
       function calculateDiscountedPrice(originalPrice, discountPercentage) {
       // Calculate the discounted price
       const discountAmount = (originalPrice * discountPercentage) / 100;
       const discountedPrice = originalPrice - discountAmount;
   
       return discountedPrice;
       }
   
       // Usage
       const itemPrice = 100;
       const discount = 20;
       const finalPrice = calculateDiscountedPrice(itemPrice, discount);
       console.log(`Final price: $${finalPrice}`);
       ```

14. **Version Control and Collaboration:**
    - Use Git for version control and collaborate on projects using platforms like GitHub.
    - Use meaningful commit messages and create branches for features and bug fixes.

15. **Swagger:**
 - Swagger is simply the server which we can able to see and test all the api present in our app and also we can get idea about the api requirements and know how it works. 
 - For swagger integration, we have to write the code in the command like 
            /**@swagger 
            *    components
            *       schema
            */.
 - Indentation is one of the major things we need to follow while integrate the swagger ui.
 - All the swagger integration must be inside the routes folder where the api are used.
 - If we need json like object for either request or response we need to create schema for that and used that with the help of ref like below.
            /**
            * @swagger
            * components :
            *      schemas :
            *          Login :
            *              type : object
            *              required :
            *                  - email
            *                  - password
            *              properties :
            *                  email :
            *                      type : string
            *                      example : demo@gmail.com
            *                  password :
            *                      type : string
            *                      example : password
            */

16. **Logger:**
 - Logger is generally store the activity of the every api action with timestamp and message contains the url, requestBody(if there) and response.
 - There will be three logs 1)error, 2)warn, 3)info. Use the relevant log for your needs while create the api.
    For Example :
     **infoLogger.info(loggerLogFormat(ENDPOINTS.REGISTER, req.body, message/response));**
 - You can also create the custom message to display that in response by use it in the 3rd arguments on the above example

17. **Linter:**
 - Linter is simply known as eslint and prettier in node js. 
 - Its mainly used for follow the uniform code format who are all work in the same project 
 - We need to install the eslint and prettier eslint for check the code format
 - By default there will be some rules to be follow like single quotes,semicolon and etc if we need to overwrite the rule we need to mention rule inside **eslintrc.cjs**
 - Configuring or initialize the eslint by run the following command **yarn install eslint, npx eslint ---init**
 - By checking or automatically fix the code format run the command **npx eslint --fix .**

18. **Express-Validator:**
    - Express Validator is simply act as a middleware to check/validate the request body from the post api 
    - We need to use this middleware for the post,put for response and get api which have the required queries/params.
    - Created the custom function for return the error message in the response on middlewares/expressValidator.js.
    - Response must be like the below structure 
               **{ message : 'YOUR CUSTOM MESSAGE' }**
