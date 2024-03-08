import { Router } from "express";

// import config from "../../config.js";
import passport from "passport";
import UsersController from "../../controllers/users.controller.js";
import { authorizationMiddleware } from "../../helpers/utils.js";


const router = Router();

const buildResponse = (data, req) => {

    // console.log("data", data)
    return {
        title: "Profile",
        status: "success",
        user: req.user,
        payload: data.map(user => user.toJSON()),
    };
};
router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin']),
    async (req, res) => {
        try {
            const user = await UsersController.getByMail(req.user.email)
            const users = await UsersController.get();
            // console.log('users', users)
            const response = buildResponse(users, req)
            res.render('users', response)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
);




export default router;