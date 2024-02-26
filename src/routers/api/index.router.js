import { Router } from 'express';
import { verifyToken } from '../../helpers/utils.js';

const router = Router();

// const privateRouter = async (req, res, next) => {
//     const token = req.cookies.token;
//     console.log("token", req.cookies)
//     const user = await verifyToken(token)
//     if (!user) {
//         return res.redirect('/login');
//     }

//     req.user = user;
//     next();
// };

// const publicRouters = async (req, res, next) => {
//     const token = req.cookies.token;
//     console.log("req.cookies", req.cookies)


//     const user = await verifyToken(token)
//     if (user) {
//         return res.redirect('/products');
//     }
//     next();
// }

router.get('/profile',
    // privateRouter,
    (req, res) => {
        res.render('profile', { title: 'Perfil', user: req.user });
    });

router.get('/login',
    // publicRouters,
    (req, res) => {
        res.render('login', { title: 'Login' });
    });

router.get('/register',
    // publicRouters,
    (req, res) => {
        res.render('register', { title: 'Register' });
    });
router.get('/password-recovery',
    // publicRouters, 
    (req, res) => {
        res.render('password-recovery', { title: "Recuperar password" })
    })

router.get('/pass-recovery-by-mail',
    (req, res) => {
        res.render('pass-recovery-by-mail', { title: "Recuperar password" })
    }
)

router.get('/pass-recovery',
    (req, res) => {
        res.render('pass-recovery', { title: "Ingrese email" })
    })
router.get('/hello', (req, res) => {
    res.send('<h1>Hello People 😎!</h1>');
});

export default router;