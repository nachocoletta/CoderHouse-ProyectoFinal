import { expect } from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import mongoose from 'mongoose';
import 'dotenv/config';
import { getNewId } from '../src/helpers/utils.js';

const requester = supertest('http://localhost:8080');

describe('Test del modulo de carts', function () {

    this.timeout(8000);
    let cookie;
    let pid;
    let cid;
    const userMock = {
        first_name: 'Nombre',
        last_name: 'Apellido',
        email: 'na@hotmail.com',
        age: 50,
        password: '1234',
        rol: 'premium'
    };

    before(async function () {
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

        const {
            statusCode: userStatusCode,
            ok: userOK,
            _body: userBody
        } = await requester.post('/auth/register').send(userMock);


        const {
            headers,

        } = await requester.post('/auth/login').send(userMock);
        await requester.post('/auth/login').send(userMock);
        const [key, value] = headers['set-cookie'][0].split('=');
        cookie = { key, value };


        const {
            statusCode: statusCodeCurrent,
            ok: okCurrent,
            _body: bodyCurrent
        } = await requester.get('/auth/current')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);

        // console.log("bodyCurrent", bodyCurrent)

        cid = bodyCurrent.cartId;

        const productMock = {
            title: faker.commerce.productName(),
            description: `${faker.commerce.productName()} = ${faker.lorem.word(5)}`,
            code: getNewId(),
            price: faker.number.float({ min: 1, max: 1000000, precision: 0.01 }),
            stock: faker.number.int({ min: 0, max: 10000 }),
            category: faker.commerce.department()
        };

        const {
            statusCode,
            ok,
            _body,
        } = await requester.post('/api/products').send(productMock)
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);;

        // console.log("_body", _body)
        pid = _body._id;

    })

    after(async function () {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        await mongoose.connection.close();
    })

    it('Obtiene todos los carritos', async function () {
        const {
            statusCode,
            ok,
            _body,
        } = await requester.get('/api/carts');

        // console.log("_body", _body)
        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(Array.isArray(_body)).to.be.true;

    });

    it('Obtiene un carrito por su id', async function () {
        const {
            statusCode: firstStatusCode,
            ok: firstOK,
            _body: response1,
        } = await requester.get('/auth/current')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);;

        const cid = response1.cartId;

        const {
            statusCode: secondStatusCode,
            ok: secondOK,
            _body: response2,
        } = await requester.get(`/api/carts/${cid}`)


        expect(secondStatusCode).to.be.equals(200);
        expect(response2).to.have.property('_id');
        expect(Array.isArray(response2.products)).to.be.true

    });

    it('Agrega un producto al carrito', async function () {
        let productAndQuantity = {
            productId: pid,
            quantity: 4
        }
        const {
            statusCode,
            ok,
            _body
        } = await requester.post(`/api/carts/${cid}`)
            .set('Cookie', [`${cookie.key}=${cookie.value}`])
            .send(productAndQuantity);

        // console.log("_body", _body)
        expect(statusCode).to.be.equals(201);
        expect(_body).to.have.property('products').to.be.ok;
        expect(Array.isArray(_body.products)).to.be.ok
        expect(_body.products).to.have.length(1)
    });

    it('Genera una compra', async function () {
        const {
            statusCode,
            ok,
            _body
        } = await requester.post(`/api/carts/${cid}/purchase`)

        expect(statusCode).to.be.equals(200);

    });

});
