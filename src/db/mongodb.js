import { Server } from 'socket.io';
import mongoose from 'mongoose';

import config from '../config.js';

const URL_DB = config.db.mongodbURL;
const URL_DB_TEST = config.db.mongodbURL_TEST
const ENVIRONMENT = config.ENV;


export const initDb = async () => {
    try {
        switch (ENVIRONMENT) {
            case 'test':
                await mongoose.connect(URL_DB_TEST);
                console.log('Test Database conected 🚀');
                break;
            case 'dev':
                await mongoose.connect(URL_DB);
                console.log('Dev Database conected 🚀');
                break;
            case 'prod':
                await mongoose.connect(URL_DB);
                console.log('Production Database conected 🚀');
                break;
            default:
                console.log('Wrong enviromnet')
                break;
        }

    } catch (error) {
        console.log('Ah ocurrido un error al intentar conectarnos a la DB', error.message);
    }
}
