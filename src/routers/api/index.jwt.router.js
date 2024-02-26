import { Router } from "express";

import UsersController from "../../controllers/users.controller.js";
// import UserManager from "../../dao/UserManager.js";
import { isValidPassword, tokenGenerator } from "../../helpers/utils.js";

const router = Router()
const privateRouter = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const publicRouters = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/products');
    }
    next();
}
router.get('/', (req, res) => {
    res.status(200).send('<h1>Hello World 🎃</h1>')
})

router.get('/login', publicRouters, (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // console.log('entrando a login')
    const user = await UsersController.getByMail(email);
    if (!user) {
        return res.status(401).json({ message: "Correo o clave invalidos" })
    }
    const isPassValid = isValidPassword(password, user);
    if (!isPassValid) {
        return res.status(401).json({ message: "Correo o clave invalidos" })
    }

    const token = tokenGenerator(user)
    res.status(200).json({ access_token: token });

})


export default router