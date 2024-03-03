import express from 'express';
// import expressSession from 'express-session';
import handlebars from 'express-handlebars';
import path from 'path';
import passport from 'passport';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import cookieParser from 'cookie-parser'

import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import config from './config.js';
import errorHandler from './middlewares/ErrorHandler.js';

import { init as initPassportConfig } from './config/passport.config.js';
import { addLogger } from './config/logger.js';

import indexRouter from './routers/api/index.router.js';
import indexJwtRouter from './routers/api/index.jwt.router.js';
// import { __dirname } from './helpers/utils.js';
import productsApiRouter from './routers/api/products.router.js'
import cartsApiRouter from './routers/api/carts.router.js'

import productsViewRouter from './routers/views/products.router.js';
import profileViewRouter from './routers/views/user.router.js'
import chatViewRouter from './routers/views/chat.router.js';
import cartViewRouter from './routers/views/carts.router.js';
import usersViewRouter from './routers/views/users.router.js'
import ticketsViewRouter from './routers/views/tickets.router.js'

import sessionsRouter from './routers/api/sessions.router.js';
import jwtRouter from './routers/api/jwt.router.js'
import logger from './routers/api/logger.router.js'
import usersRouter from './routers/api/users.router.js'
import ticketsRouter from './routers/api/tickets.router.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Obtén la ruta del directorio 'src'
const srcDir = dirname(__dirname);

// Obtén la ruta del directorio 'utils' dentro de 'src'
const utilsDir = path.join(srcDir, 'utils');

const app = express();

// const SESSION_SECRET = config.sessionSecret
// const URL_DB = config.db.mongodbURL
// console.log(SESSION_SECRET);
// app.use(expressSession({
//   secret: SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: URL_DB,
//     mongoOptions: {},
//     ttl: 3600,
//   }),
// }));

app.use(addLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Ecommerce CoderHouse',
            description: 'Esta es la documentación de la API del ecommerce de CoderHouse.',
        },
    },
    apis: [path.join(__dirname, '.', 'docs', '**', '*.yaml')],
};

const specs = swaggerJsDoc(swaggerOptions);


const hbs = handlebars.create({
    helpers: {
        ifCond: function (v1, operator, v2, options) {
            switch (operator) {
                case '==':
                    return v1 == v2 ? options.fn(this) : options.inverse(this);
                case '===':
                    return v1 === v2 ? options.fn(this) : options.inverse(this);
                case '!=':
                    return v1 != v2 ? options.fn(this) : options.inverse(this);
                case '!==':
                    return v1 !== v2 ? options.fn(this) : options.inverse(this);
                case '<':
                    return v1 < v2 ? options.fn(this) : options.inverse(this);
                case '<=':
                    return v1 <= v2 ? options.fn(this) : options.inverse(this);
                case '>':
                    return v1 > v2 ? options.fn(this) : options.inverse(this);
                case '>=':
                    return v1 >= v2 ? options.fn(this) : options.inverse(this);
                default:
                    return options.inverse(this);
            }
        }
    }
});
const publicDir = path.join(utilsDir, '../public');
app.use(express.static(publicDir));
app.engine('handlebars', hbs.engine);
// app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'handlebars');

initPassportConfig(); // inicializacion de passport 

app.use(passport.initialize());
// app.use(passport.session()); // este hay que comentarlo... me parece




// app.get('/', (req, res) => {
//   res.redirect('/products');
// });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
// app.use('/', indexJwtRouter)
app.use('/api/products', productsApiRouter);
app.use('/api/carts', cartsApiRouter);
app.use('/api/logger', logger);
app.use('/api/users', usersRouter);
app.use('/api/tickets', ticketsRouter);

app.use('/products', productsViewRouter);
app.use('/profile', profileViewRouter)
app.use('/chat', chatViewRouter);
app.use('/cart', cartViewRouter);
app.use('/users', usersViewRouter);
app.use('/tickets', ticketsViewRouter);


app.use('/', indexRouter);
app.use('/api', sessionsRouter);
app.use('/auth', jwtRouter)

app.use(errorHandler);
// app.use((error, req, res, next) => {
//   const message = `Ha ocurrido un error desconocido 😨: ${error.message}`;
//   console.log(message);
//   res.status(500).json({ status: 'error', message });
// });

export default app;
