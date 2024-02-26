import { verifyToken } from "../helpers/utils.js";
import EmailService from "./email.services.js";

export default class AuthServices {
    static async passwordRestore(email, token) {
        // console.log('token en pass restore', await verifyToken(token))
        // console.log(email)


        const emailService = EmailService.getInstance();
        await emailService.sendResetPasswordLink(token, email)



    }
}