import { Router } from 'express';

const router = Router();

router.get('/loggerTest',
    (req, res) => {
        req.logger.fatal(`Logger fatal`);
        req.logger.error(`Logger error`);
        req.logger.warning(`Logger warning`)
        req.logger.info(`Logger info`)
        req.logger.http(`Logger http`)
        req.logger.debug(`Logger debug`)
    }
)

export default router;