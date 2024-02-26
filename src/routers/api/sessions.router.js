import { Router } from 'express';
import 'dotenv/config';
import UserManager from '../../dao/UserManager.js';
import { createHash, isValidPassword } from '../../helpers/utils.js'
import passport from 'passport';
const router = Router();

router.post('/sessions/register', async (req, res) => {
    // console.log('entra'); 
    const { body } = req;

    const newUser = await UserManager.create({
        ...body,
        password: createHash(body.password)
    });

    console.log('newUser', newUser);
    res.redirect('/login');
});

// router.post('/sessions/register',
//     passport.authenticate('register', { failureRedirect: '/register' }),
//     (req, res) => {
//         res.redirect('/login')
//     })


router.post('/sessions/login',
    passport.authenticate('login', { failureRedirect: '/login' }),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/products')
    })
// router.post('/sessions/login', async (req, res) => {
//     const { body } = req
//     const { email, password } = body;

//     const userAdmin = {
//         username: process.env.ADMIN_USER,
//         password: process.env.ADMIN_PASSWORD,
//         rol: process.env.ADMIN_ROL
//     };
//     // const { body: { email, password } } = req;
//     try {
//         if (email === userAdmin.username && password === userAdmin.password) {
//             req.session.user = { first_name: "Admin", last_name: "Coderhouse", email: userAdmin.username, rol: userAdmin.rol };
//             return res.redirect('/products');
//         }

//         const user = await UserManager.getByMail(email)
//         // console.log("user", user)
//         if (!user) {
//             return res.status(401).send('Correo o contraseña invalidos 😨.');
//         }
//         const isPassValid = isValidPassword(password, user);
//         if (!isPassValid) {
//             return res.status(401).send('Correo o contraseña invalidos 😨.');
//         }
//         // console.log(user);
//         const { first_name, last_name, rol } = user;
//         req.session.user = { first_name, last_name, email, rol };
//         res.redirect('/products');
//     } catch (error) {
//         res.status(500).json({ error: error.message })
//     }
// });

router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/sessions/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
        // console.log('req.user', req.user);
        req.session.user = req.user;
        res.redirect('/products')
    }
)
router.post('/sessions/password-recovery', async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await UserManager.getByMail(email)

    if (!user) {
        return res.status(401).send('Correo o contraseña invalidos 😨.');
    }
    try {
        const updatedUser = await UserManager.update(email, newPassword)
        if (updatedUser) {
            // res.status(201).json({ message: "Usuario actualizado", updatedUser })
            res.redirect('/login')
        } else {
            res.status(500).json({ message: "Error al actualizar el usuario" })
        }
    } catch (error) {
        console.log('Error', error.message)
        res.status(500).json({ message: "Error al actualizar el usuario" })

    }

});


router.get('/sessions/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/login');
    });
});

export default router;