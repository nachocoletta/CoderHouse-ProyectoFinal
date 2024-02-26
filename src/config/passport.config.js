import passport from 'passport';
import { Strategy as LocalStrategy, Strategy } from 'passport-local';
import { Strategy as GithubStrategy } from 'passport-github2'
import { createHash, isValidPassword } from '../helpers/utils.js';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import UserManager from '../dao/UserManager.js';
import UsersController from '../controllers/users.controller.js';
// import 'dotenv/config';

import config from '../config.js';

const options = {
    usernameField: 'email',
    passReqToCallback: true,
}
const githubOptions = {
    clientID: config.github.clientGithub,
    clientSecret: config.github.secretGithub,
    callbackURL: config.github.urlCallbackGithub
}

const JWTOptions = {
    jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // recibe un array de funciones que nos ayudan a extraer la informacion
    secretOrKey: config.jwtSecret
}

function cookieExtractor(req) {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies.access_token;
    }
    return token
}

export const init = () => {
    passport.use('register', new LocalStrategy(options, async (req, email, password, done) => {
        try {
            const user = await UserManager.getByMail(email);
            if (user) {
                return done(new Error('User already registered'));
            }
            const newUser = await UserManager.create({
                ...req.body,
                password: createHash(password)
            })
            done(null, newUser);

        } catch (error) {
            done(new Error(`Ocurrio un error durante la autenticacion ${error.message}.`));
        }
    }))

    passport.use('login', new LocalStrategy(options, async (req, email, password, done) => {
        try {
            const user = await UserManager.getByMail(email);
            if (!user) {
                return done(new Error('Correo o contraseña invalidos 😨'));
            }
            const isPassValid = isValidPassword(password, user);
            if (!isPassValid) {
                return done(new Error('Correo o contraseña invalidos 😨'));
            }
            done(null, user);
        } catch (error) {
            done(new Error(`Ocurrio un error durante la autenticacion ${error.message}.`));
        }
    }))

    passport.use('github', new GithubStrategy(githubOptions, async (accessToken, refreshToken, profile, done) => {
        // console.log('profile', profile)
        const email = profile._json.email
        let user = await UserManager.getByMail(email)
        if (user) {
            return done(null, user)
        }
        user = {
            first_name: profile._json.name,
            last_name: '',
            email,
            age: 45,
            password: "",
            rol: "user",
            provider: "Github"
        }
        const newUser = await UserManager.create(user);
        done(null, newUser);

    }))

    passport.use('jwt', new JWTStrategy(
        JWTOptions,
        async (payload, done) => {
            // console.log("payload", payload);
            const user = await UsersController.getById(payload.id)
            return done(null, user)
        }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (uid, done) => {
        const user = await UsersController.getById(uid);
        done(null, user);
    });
}
