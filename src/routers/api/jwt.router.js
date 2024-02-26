import { Router } from 'express';
// import 'dotenv/config';
// import UserManager from '../../dao/UserManager.js';
import UsersController from '../../controllers/users.controller.js';
import AuthController from '../../controllers/auth.controller.js';
import { userRepository } from '../../repositories/index.js';

import {
    createHash, isValidPassword,
    jwtAuth, tokenGenerator,
    verifyToken, authMiddleware,
    authorizationMiddleware
} from '../../helpers/utils.js'
import passport from 'passport';
import AuthServices from '../../services/auth.services.js';
import UsersService from '../../services/users.services.js';
import moment from 'moment';
import 'moment-timezone';


const router = Router();


// aca va auth adelante de cada ruta
router.post('/login',
    async (req, res, next) => {
        const { email, password } = req.body;
        const lastConnection = { last_connection: new Date() };

        // console.log("email", email)
        // console.log("password", password)
        // console.log('entrando a login ahora con jwt')
        // console.log(email)
        // console.log(password)
        try {
            // const user = await UsersController.getByMail(email)
            const user = await UsersController.get({ email })
            // console.log(user);


            if (user.length === 0) {
                // console.log('1')
                req.logger.warning(`Correo o password invalidos`)
                return res.status(401).json({ message: "Correo o password invalidos" })
            }
            const isPassValid = isValidPassword(password, user[0])
            if (!isPassValid) {
                // console.log('2')
                req.logger.warning(`Correo o password invalidos`)
                return res.status(401).json({ message: "Correo o password invalidos" })
            }

            UsersController.updateLastConnection(user[0]._id, lastConnection);

            const token = tokenGenerator(user[0], 'login');
            // console.log('paso por aca')
            // res.status(200).json({ access_token: token })
            res
                .cookie('access_token',
                    token,
                    { maxAge: 1000 * 60 * 60, httpOnly: true })
                .status(200)
                // .json({ status: 'success' })
                .redirect('/products')
        } catch (error) {
            console.log(`Error ${error.message}`);
            next(error)
            // return res.status(500).json({ error: error.message })
        }
    })

router.post('/register',
    async (req, res, next) => {

        try {
            // console.log('entra')
            const { body } = req;

            console.log("body", body)
            const newUserToken = await AuthController.register({
                ...body,
                password: createHash(req.body.password)
            });
            // console.log("newUser", newUser)
            // req.logger.info(`Nuevo Usuario ${newUser}`)
            // console.log('newUser', newUser);
            return res.status(200).json({ status: 'success', message: 'User registered successfully', payload: newUserToken });
        } catch (error) {
            req.logger.error(error.message)
            next(error)
        }
    });

router.get('/current',
    // jwtAuth,
    authMiddleware('jwt'), // aca le mando la estrategia que quiero usar, en este caso jwt
    async (req, res) => {
        // console.log(req.user);
        try {
            // console.log("entra a estrategia current")
            // console.log("req.user", req.user)

            const user = await userRepository.getCurrent(req.user.id)

            res.status(200).json(user)
            // console.log("user", user)
            // res.status(200).json(req.user)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    })

router.get('/cart',
    // jwtAuth,
    authMiddleware('jwt'), // aca le mando la estrategia que quiero usar, en este caso jwt
    async (req, res) => {
        // console.log(req.user);
        try {
            console.log("entra a estrategia current")
            console.log("req.user", req.user)

            // const user = await userRepository.getCurrent(req.user.id)

            res.status(200).json(req.user)
            // console.log("user", user)
            // res.status(200).json(req.user)
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    })
router.get('/users',
    async (req, res, next) => {
        try {
            const users = await UsersController.get();
            res.status(200).json(users)
        } catch (error) {
            console.error("Error", error.message)
            next(error)
        }
    })

router.get('/pass-recovery-by-mail/:token',
    async (req, res, next) => {
        //esta es la ruta que se entra en el link que se recibe en el mail
        const { token } = req.params;

        try {
            const { exp, email } = await verifyToken(token)

            const currentTime = Math.floor(Date.now() / 1000);
            // console.log(email)
            const data = {
                email
            }

            if (exp && exp < currentTime) {
                res.redirect('/pass-recovery')
                // return res.status(400).json({ message: `Tiempo expirado para cambiar la clave` })
            } else {

                res.render('pass-recovery-by-mail', data)
                // res.status(200).json({ token, message: 'tiempo ok' })
            }
        } catch (error) {

            // no se porque entra al catch y no al if
            res.redirect('/pass-recovery')
            // return res.status(400).json({ message: `Tiempo expirado para cambiar la clave` })
            console.log(error.message)
            next(error)
        }
    }
)
// router.post('/password-restore/', (req, res) => {
//     const { email } = req.params.email;
//     // Resto de la lógica para procesar el formulario con el parámetro 'email'
//     res.status(200).json(email)
// });

router.post('/pass-restore',
    async (req, res) => {
        // const { email } = req.params
        const { email } = req.body;
        return res.status(200).json({ message: email })
    }
)

router.post('/password-restore/:email',
    async (req, res, next) => {
        const { pass, repeated_pass } = req.body;
        const { email } = req.params;
        try {
            // console.log('email', email)
            if (pass === repeated_pass) {
                // Si se trata de restablecer la contraseña con la misma contraseña del usuario, debe impedirlo e indicarle que no se puede colocar la misma contraseña

                const user = await UsersController.getByMail(email);

                if (!isValidPassword(pass, user)) { // si las pass es distinta a la que ya tiene en la base de datos
                    //aca debo cambiarla
                    const user = await UsersService.findAll({ email })

                    console.log("user", user)
                    await UsersService.updateById(user[0]._id,
                        {
                            password: createHash(pass)
                        }
                    )

                    return res.status(201).send('Clave actualizada')
                }
                res.status(400).json({ error: `La clave no puede ser igual a la anterior` })


            } else {
                res.status(400).json({ error: 'Las claves deben ser iguales' })
            }
        } catch (error) {
            console.log(error.message)
            next(error)
        }


    }
)
router.post('/pass-recovery-by-mail',
    async (req, res, next) => {
        const { email } = req.body;
        // console.log("access_token: ", req.cookies.access_token)
        // return res.status(200).json({ token: req.cookies.access_token })
        try {
            const user = await UsersController.get({ email })

            if (user.length > 0) {
                // console.log(user)
                const token = tokenGenerator(user[0], 'recovery')

                // console.log("token", token)
                // return res.redirect('/')
                // res.cookie('access_token', token, { maxAge: 1000 * 60 * 60, httpOnly: true })

                // res.cookie('access_token', token, { maxAge: 1000 * 30, httpOnly: true })

                await AuthServices.passwordRestore(user[0].email, token)

                return res.status(200).json({ message: `Mail enviado, revise su casilla de correo: ${email} que contiente un link para restaurar su clave` })
            }

            res.status(404).json({ message: "Usuario no encontrado" });
            // res.status(200).json({ message: "Si el usuario existia se envio un mail con un link para restablecer la clave" })
        } catch (error) {
            console.log('error', error.message)
            next(error)
        }
    }
)
router.get('/pass-recovery-by-mail',
    async (req, res, next) => {
        const { email } = req.body;
        // console.log("access_token: ", req.cookies.access_token)
        // return res.status(200).json({ token: req.cookies.access_token })
        try {
            const user = await UsersController.get({ email })

            // console.log(user)
            if (user.length > 0) {
                const token = tokenGenerator(user[0], 'recovery')
                // res.cookie('access_token', token, { maxAge: 1000 * 60 * 60, httpOnly: true }) // linea original
                // console.log("access_token en pass-recovery-by-mail", req.cookies.access_token)
                res.cookie('access_token', token, { maxAge: 1000 * 30, httpOnly: true })
                await AuthServices.passwordRestore(token)
                // await AuthServices.passwordRestore(req.cookies.access_token)

                return res.status(200).json({ token })
            }

            res.status(404).json({ message: "Usuario no encontrado" });
            // res.status(200).json({ message: "Si el usuario existia se envio un mail con un link para restablecer la clave" })
        } catch (error) {
            console.log('error', error.message)
            next(error)
        }
    }
)




router.post('/password-recovery',
    async (req, res, next) => {
        const { email, newPassword } = req.body;


        try {
            const user = await UsersController.get({ email })

            if (!user) {
                return res.status(401).json({ message: "Correo o password invalidos" })
            }

            const updatedUser = await AuthController.resetPassword({ email, newPassword })

            return res.status(204).end()
        } catch (error) {
            next(error)
        }

    }
)
// router.post('/register', async (req, res) => {
//     console.log('entra');
//     console.log(req.body)

//     // const newUser = await UserManager.create({
//     //     ...body,
//     //     // password: createHash(body.password)
//     // });

//     // console.log('newUser', newUser);
//     res.status(200).json(req.body)
// });


export default router;