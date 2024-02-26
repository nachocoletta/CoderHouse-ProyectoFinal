import { expect } from 'chai';
import supertest from 'supertest';
import { faker } from '@faker-js/faker';
import { getNewId } from '../src/helpers/utils.js';
import mongoose from 'mongoose';
import config from '../src/config.js';
import 'dotenv/config';

// const expect = chai.expect;
const requester = supertest('http://localhost:8080');

describe('Tests del modulo products', function () {
    this.timeout(8000);
    let cookie;

    const userMock = {
        first_name: 'Nombre',
        last_name: 'Apellido',
        email: 'na@hotmail.com',
        age: 50,
        password: '1234',
        rol: 'admin'
    };
    before(async function () {

        await mongoose.connect(
            process.env.DB_MONGO_ATLAS_TEST
            // config.db.mongodbURL_TEST
            // ,
            // { useNewUrlParser: true, useUnifiedTopology: true }
        );

        // Verifica si hay alguna colección existente antes de intentar eliminarla
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }

        await requester.post('/auth/register').send(userMock);

        const {
            headers,
            statusCode,
            ok,
            _body
        } = await requester.post('/auth/login').send(userMock);
        await requester.post('/auth/login').send(userMock);
        const [key, value] = headers['set-cookie'][0].split('=');
        cookie = { key, value };
    });


    after(async function () {
        const collections = await mongoose.connection.db.collections();
        for (let collection of collections) {
            await collection.deleteMany({});
        }
        await mongoose.connection.close();
    })
    it('Debe crear un producto correctamente', async function () {
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

        // console.log("statusCode", statusCode)
        // console.log("ok", ok)
        // console.log("_body", _body)
        expect(statusCode).to.be.equals(201);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('_id')
    });

    it('Obtiene la lista de productos', async function () {
        const {
            statusCode,
            ok,
            _body
        } = await requester.get('/api/products')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);

        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(Array.isArray(_body.docs)).to.be.ok;
        expect(_body.docs).to.have.length(1)
        // console.log("body", _body)
    });

    it('Obtiene un producto por su id', async function () {
        let { _body: firstResponseBody } = await requester.get('/api/products')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);

        const pid = firstResponseBody.docs[0]._id;

        const {
            statusCode,
            ok,
            _body
        } = await requester.get(`/api/products/${pid}`)
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);

        expect(statusCode).to.be.equals(200);
    });

    it('Crea 5 productos Mocking', async function () {
        let { statusCode, ok, _body } = await requester.post('/api/products/mockingproducts')
            .set('Cookie', [`${cookie.key}=${cookie.value}`]);

        expect(statusCode).to.be.equals(200);
        expect(ok).to.be.ok;
        expect(_body).to.have.property('message', 'Productos creados')

    })


});

