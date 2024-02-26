import { Router } from "express";
// import CartManager from "../../dao/CartManager.js"
import CartController from "../../controllers/cart.controller.js";
const router = Router();

const buildResponse = (cid, data) => {

    const payload = data.products.map(product => product.toJSON())
    // console.log("payload", payload)
    return {
        cartId: cid,
        payload
    }

}
router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const result = await CartController.getById(cid)
        // console.log('result', result);
        // console.log('resultB', result.products.p);
        // console.log('result', result.products);
        // const payload = result.toJSON()
        // buildResponse(result)

        res.render('cart', buildResponse(cid, result))
    } catch (error) {
        console.log('Error', error.message);
    }
    // console.log("result", result);
})

export default router;