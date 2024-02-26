import { Router } from 'express';
import UsersService from '../../services/users.services';
import UsersController from '../../controllers/users.controller';
import { authMiddleware, isValidPassword, tokenGenerator } from '../../helpers/utils.js'
const router = Router();

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await UsersController.getByMail(email);
    // console.log("user", user)
    if (!user) {
        return res.status(401).json({ message: 'Email o pass invalidos.' });
    }
    const isValidPass = isValidPassword(password, user);
    if (!isValidPass) {
        return res.status(401).json({ message: 'Email o pass invalidos.' });
    }

    const token = tokenGenerator(user);

    res.cookie('access_token', token, {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        signed: true
    })
        .status(200)
        // .json({ status: 'success' })
        .redirect('/product');
})

router.get('/current',
    authMiddleware('jwt'),
    (req, res) => {
        res.status(200).json(req.user)
    })
export default router;