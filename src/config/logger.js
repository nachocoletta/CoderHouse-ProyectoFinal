import winston from 'winston';

import config from '../config.js'

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: "red",
        error: "magenta",
        warning: "yellow",
        info: "blue",
        http: "cyan",
        debug: "white"
    }
}
export const loggerProd = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error'
        })
    ]
})
export const loggerDev = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            ),
        })
    ]
})

export const addLogger = (req, res, next) => {
    req.logger = config.ENV === 'prod' ? loggerProd : loggerDev
    // req.logger = logger;
    req.logger.http(`${req.method} en ${req.url} - ${(new Date().toLocaleTimeString())}`)
    next();
}