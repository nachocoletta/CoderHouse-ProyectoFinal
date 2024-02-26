import { Router } from "express";

// import config from "../../config.js";
import passport from "passport";
import UsersController from "../../controllers/users.controller.js";

const router = Router();

const buildResponse = (data, req) => {

    // console.log("req", req);

    return {
        title: "Profile",
        status: "success",
        user: req.user,
        // payload: data.docs.map(product => product.toJSON()),
    };
    // const category = data.docs.length > 0 ? data.docs[0].category : undefined;

};
router.get('/',
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        try {
            // console.log("req.user", req.user)
            const user = await UsersController.getByMail(req.user.email)
            // console.log("user", user)
            const response = buildResponse(user, req)
            // console.log("response", response)
            res.render('profile', response)
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    }
)
export default router;