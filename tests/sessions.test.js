import { expect } from 'chai';
import supertest from 'supertest';
import mongoose from 'mongoose';
import config from '../src/config.js';
import 'dotenv/config';

const requester = supertest('http://localhost:8080');

describe('Test del modulo sessions', function () {
    this.timeout(8000)
    const userMock = {
        first_name: 'Nombre',
        last_name: 'Apellido',
        email: 'na@hotmail.com',
        age: 50,
        password: '1234'
    };
    let authToken;
    let accessToken;

    let cookie;


    before(async function () {
        // Asegúrate de que la conexión a la base de datos se haya establecido correctamente
        let cadenaConexion = process.env.DB_MONGO_ATLAS_TEST;
        // console.log(cadenaConexion)
        // await mongoose.connect(config.db.mongodbURL_TEST)
        await mongoose.connect(cadenaConexion
            // ,
            // { useNewUrlParser: true, useUnifiedTopology: true }
        );

        // Verifica si hay alguna colección existente antes de intentar eliminarla
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
    });

    after(async function () {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        await mongoose.connection.close();
    });

    it('Crea un usuario de forma correcta', async function () {
        // const userMock = {
        //     first_name: 'Nombre',
        //     last_name: 'Apellido',
        //     email: 'na@hotmail.com',
        //     age: 50,
        //     password: '1234'
        // };

        const {
            statusCode,
            ok,
            _body,
        } = await requester.post('/auth/register').send(userMock);

        // console.log("statusCode", statusCode)
        // console.log("ok", ok)
        // console.log("_body", _body)
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('status', 'success');
        expect(_body).to.have.property('message', 'User registered successfully')
    });

    it('Loguea un usuario en forma exitosa y redirecciona a /products', async function () {
        const {
            headers,
            statusCode,
            ok,
            _body
        } = await requester.post('/auth/login').send(userMock);

        // console.log("header", header)
        // console.log("headers", headers)
        // console.log("statusCode", statusCode)
        // console.log("ok", ok)
        // console.log("_body", _body)
        expect(statusCode).to.be.equals(302);
        expect(headers).to.have.property('location', '/products');

        // const cookies = headers['set-cookie'];
        // authToken = cookies
        //     .map(cookie => cookie.split(';')[0])
        //     .find(cookie => cookie.startsWith('access_token='));
        // // authToken = cookies.find(cookie => cookie.startsWith('access_token'));

        // expect(authToken).to.exist;
        // // console.log(cookies)

        // accessToken = authToken.split(';')[0].split('=')[1];

        const [key, value] = headers['set-cookie'][0].split('=');
        cookie = { key, value };
        // console.log('cookie', cookie);
    });

    it('Obtiene el usuario actual con un token válido', async function () {
        // console.log("accessToken", accessToken)
        // const response = await requester.get('/auth/current')
        //     .set('Authorization', accessToken); // Envía el token en la cabecera Authorization
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/auth/current')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        // console.log("response", response)
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('email', userMock.email);
        // Agrega más aserciones según lo que esperas en la respuesta del usuario actual
    });

    it('Obtiene el carrito de un usuario', async function () {
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/auth/cart')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);
        expect(statusCode).to.be.equals(200);
        // expect(ok).to.be.ok;
        // expect(Array.isArray(_body)).to.be.ok;

    })

    it('Obtiene un listado de los usuarios', async function () {
        const {
            header,
            statusCode,
            ok,
            _body
        } = await requester.get('/auth/users')

        // console.log("statusCode", statusCode)
        // console.log("ok", ok)
        // console.log("_body", _body)
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(Array.isArray(_body)).to.be.equals(true)
    });
})