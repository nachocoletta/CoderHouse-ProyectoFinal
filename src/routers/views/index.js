import { Router } from 'express';

// import UserManager from '../../dao/UserManager.js';

const router = Router();


router.get('/', async (req, res) => {
    try {
        res.render()
    } catch (error) {
        console.log(`Error ${error.message}`)
    }
})



export default router;