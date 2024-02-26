import { Router } from "express";
import { emitFromApi } from '../../socket.js'
import passport from "passport";
import { authorizationMiddleware } from "../../helpers/utils.js";

const router = Router();

router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('user'),

    (req, res) => {
        res.render('chat', { title: "Chat" });
    })

router.post('/messages',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware('user'),
    (req, res) => {
        emitFromApi('new-message-from-api', { username: 'api', text: 'Hola desde el API 🤩' });
        res.status(200).json({ ok: true });
    });

export default router;