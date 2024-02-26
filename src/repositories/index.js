import UserRepository from './user.repository.js'
import { UserDao } from '../dao/factory.js'

// console.log("UserDao", UserDao)
const newUserDao = new UserDao()
// console.log("newUserDao", newUserDao);
export const userRepository = new UserRepository(newUserDao);


