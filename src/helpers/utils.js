import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import multer from "multer";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
// import 'dotenv/config';
import passport from "passport";
// import UserManager from "../dao/UserManager.js";
import UsersService from "../services/users.services.js";

import config from "../config.js";
import { log } from "console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ajustar el __dirname para que apunte al directorio 'src/utils'
const srcDir = dirname(__dirname);
const utilsDir = path.join(srcDir, 'utils');

export { __filename, __dirname, utilsDir };


export const getNewId = () => uuidv4();

const existFile = async (path) => {
    try {
        await fs.promises.access(path);
        return true;
    } catch (error) {
        return false;
    }
};

export const getJSONFromFile = async (path) => {
    if (!(await existFile(path))) {
        return [];
    }

    let content;

    try {
        content = await fs.promises.readFile(path, "utf-8");
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser leido.`);
    }

    try {
        return JSON.parse(content);
    } catch (error) {
        throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
    }
};

export const saveJSONToFile = async (path, data) => {
    // console.log(path, data)
    // return
    const content = JSON.stringify(data, null, "\t");
    try {
        await fs.promises.writeFile(path, content, "utf-8");
    } catch (error) {
        throw new Error(`El archivo ${path} no pudo ser escrito.`);
    }
};

export class Exception extends Error {
    constructor(message, status) {
        super(message);
        this.statusCode = status;
    }
};

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const pathFile = path.join(__dirname, '../../public/productImages');
//         cb(null, pathFile);
//     },
//     filename: (req, file, cb) => {
//         const filename = `${Date.now()}-${file.originalname}`;
//         cb(null, filename)
//     }
// })


// const storage = multer.diskStorage({
//     destination: './public/productImages',
//     filename: (req, file, cb) => {
//         console.log(file)
//         const filename = file.path;
//         cb(null, filename);
//     }
// });


export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const isValidPassword = (plainPasswordFromLogin, user) => {
    return bcrypt.compareSync(plainPasswordFromLogin, user.password)
}

const storage = multer.diskStorage({
    destination: './public/productImages',
    filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename.replace(/\\/g, "/")); // Reemplazar barras invertidas con barras normales
    }
});

export const uploader = multer({ storage })

// let documentType;
const storageV2 = multer.diskStorage({
    destination: (req, file, callback) => {
        try {
            const { typeFile } = req.params;
            let folderPath = null;
            // console.log("typeFile", typeFile);

            switch (typeFile) {
                case "profile":
                    // console.log('profile')
                    folderPath = path.resolve(__dirname, '..', 'images', 'profiles')
                    break;
                case "products":
                    folderPath = path.resolve(__dirname, '..', 'images', 'products')
                    break;
                case "documents":
                    folderPath = path.resolve(__dirname, '..', 'images', 'documents')
                    break;
                default:
                    return callback(`Parametro invalido ${typeFile}`)

            }
            fs.mkdirSync(folderPath, { recursive: true })
            callback(null, folderPath)
        } catch (error) {
            console.log("Error", error.message)
            callback(error)
        }
    },
    filename: (req, file, callback) => {
        const { id } = req.user;
        // const { documentType } = req.body
        try {
            console.log("req.body")
            console.log(req.body)
            // switch (documentType) {
            //     case 'Id':
            //         console.log('Id')
            //         break;
            //     case 'domicilio':
            //         break;
            //     case 'estadoCuenta':
            //         break;
            //     default:
            //         break;
            callback(null, `${id}_${file.originalname}`)
        }

        catch (error) {
            console.log("error", error.message)
            callback(error)
        }
    }
})


export const uploaderV2 = multer({
    storage: storageV2, fileFilter: (req, file, cb) => {
        const { documentType } = req.body;
        // console.log("documentType en fileFilter", req.body)
        cb(null, true)
    }
})


const JWT_SECRET = config.jwtSecret;
export const tokenGenerator = (user, typeOfToken) => {
    const { _id, first_name, last_name, email } = user

    // console.log("req.user en tokenGenerator", user)
    // console.log(_id)
    const payload = {
        id: _id,
        first_name,
        last_name,
        email,
        login: (typeOfToken === 'login') ? true : false,
        recovery: (typeOfToken === 'recovery') ? true : false
    }
    let token;
    if (typeOfToken === 'login') {
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' })
    }
    else if (typeOfToken === 'recovery') {
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' })
    } else {
        token = jwt.sign(payload, JWT_SECRET, { expiresIn: '60m' })
    }
    return token;

}

export const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                return reject(error);
            }
            resolve(payload)
        })
    })
}

// middleware de autorizacion
export const jwtAuth = (req, res, next) => {
    // aca authorization va en minuscula pese a que en el header viene en mayuscula
    const { authorization: token /*renombrado a token */ } = req.headers; // busca en la cabecera el token y se guarda en authorization
    if (!token) {
        // return res.status(401).json({ message: 'unauthorized' })
        return res.status(401).redirect('/login')
    }
    jwt.verify(token, JWT_SECRET, async (error, payload) => {
        if (error) {
            // return res.status(403).json({ message: 'no authorized' })
            return res.status(401).redirect('/login')
        }
        req.user = await UsersService.findById(payload.id)
        // req.user = await UserManager.getById(payload.id)
        next();
    })
}

export const authMiddleware = (strategy) => (req, res, next) => { // funcion que retorna otra funcion (clousure)
    // console.log("req en authmiddleware", req)
    passport.authenticate(strategy, function (error, user, info) {
        // console.log("user", user)
        // next();
        // return res.status(200).send('ok')
        if (error) {
            // console.log('error en authMiddleware', error)
            return next(error);
        }
        if (!user) {
            // console.log('error en authMiddleware', error)
            return res.status(401).json({ message: info.message ? info.message : info.toString() }) // info.message trae la informacion de error
        }
        req.user = user;
        next();
    })(req, res, next) // la respuesta de la funcion authenticate no es mas que el middleware ara la siguiente
}

export const authorizationMiddleware = (roles) => (req, res, next) => {
    // console.log("req.user", req.user)
    if (!req.user) {
        return res.status(401).redirect('/products')
        // return res.status(401).json({ message: 'Unauthorized' });
    }

    const { rol: userRole } = req.user;
    if (!roles.includes(userRole)) {
        return res.status(403).redirect('/products')
        // return res.status(403).json({ message: 'Forbidden' });
    }
    next();
}