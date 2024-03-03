import { Router } from "express";

const router = Router();

router.get('/:userEmail',
    async (req, res, next) => {
        try {
            const { userEmail } = req.params;


        } catch (error) {
            console.log("Error", error.message);
            next(error);
        }
    })


export default router;