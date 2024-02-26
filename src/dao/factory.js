import config from "../config.js";


export let ProductDao;
export let UserDao;

switch (config.persistence) {
    case 'mongodb':
        UserDao = (await import('./user.dao.js')).default
        ProductDao = (await import('./product.dao.js')).default // lleva await porque devuelve una promesa el import y default va porque se exporta de tal forma
        break;
    case 'file':
        UserDao = (await import('./user.dao.js')).default
        ProductDao = (await import('./product.dao.file.js')).default // este archivo no existe es para ver que funciona
        break;

    default:
        UserDao = (await import('./user.dao.js')).default
        ProductDao = (await import('./product.dao.js')).default
        break;
}