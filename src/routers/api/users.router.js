import express from 'express';
import { Router } from "express";
import { uploader, uploaderV2 } from "../../helpers/utils.js";
import passport from "passport";

import UsersController from "../../controllers/users.controller.js";
import { documentTypes } from '../../models/user.model.js';
// import UserDTO from '../../dto/user.dto.js';
import UsersDTO from '../../dto/users.dto.js';
import { authorizationMiddleware } from "../../helpers/utils.js";

const router = Router();

// router.get('/premium/:uid',
//     async (req, res, next) => {
//         const { uid } = req.params;

//         try {
//             let user = await UsersController.getById(uid);

//             if (user) {
//                 if (user.rol === 'user') {

//                     await UsersController.updateById(uid, { rol: "premium" })
//                 } else {
//                     await UsersController.updateById(uid, { rol: 'user' })
//                 }
//                 user = await UsersController.getById(uid)
//                 return res.status(200).json({ message: `User ${user.firstName} ${user.lastName} is now ${user.rol}` });
//             }

//             return res.status(400).json({ error: `Usuario con id ${uid} no encontrado` })

//         } catch (error) {
//             console.log('Error', error.message)
//             next(error)
//         }
//     }
// )

router.get('/premium/:uid',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin']),
    async (req, res, next) => {
        const { uid } = req.params;

        try {
            // console.log('entra')
            let user = await UsersController.getById(uid);

            if (user) {
                if (user.rol === 'user') {
                    // const documentTypes = ['Id', 'address', 'accountStatus']
                    // console.log("user", user)
                    let count = 0;
                    const totalTypes = documentTypes.length;
                    console.log(user.documents);
                    user.documents.forEach((document, index) => {
                        for (let i = 0; i < totalTypes; i++) {
                            if (document.documentType.includes(documentTypes[i])) {
                                count++;
                                break;
                            }
                        }
                    })

                    if (count === totalTypes) {
                        await UsersController.updateById(uid, { rol: "premium" })
                    } else {
                        return res.status(400).json({ error: "Faltan documentos, no se puede promover a premium" })
                    }
                } else {
                    await UsersController.updateById(uid, { rol: 'user' })
                }
                user = await UsersController.getById(uid)
                return res.status(200).json({ message: `User ${user.firstName} ${user.lastName} is now ${user.rol}` });
            }

            return res.status(400).json({ error: `Usuario con id ${uid} no encontrado` })

        } catch (error) {
            console.log('Error', error.message)
            next(error)
        }
    }
)

router.post('/:uid/documents/:typeFile',
    passport.authenticate('jwt', { session: false }),
    uploaderV2.single('file'),
    // uploaderV2.array('documentsDomicilio', 3),
    async (req, res, next) => {
        try {
            const { typeFile } = req.params
            const file = req.file;
            const { uid } = req.params;
            // console.log("file", file.fieldname, file.filename)
            // const { documents } = req.file
            const { documentType } = req.body;
            // console.log("documentType", documentType)


            let user = await UsersController.get({ _id: uid });

            if (user.length === 0) {
                return res.status(404).json({ error: "error", message: "usuario no encontrado en la DB" })
            }
            await UsersController.updateDocument(uid, {
                name: typeFile,
                reference: file.filename,
                documentType
            });

            const updatedUser = await UsersController.get({ _id: uid });

            res.status(201).json({ message: `Documento subido`, user: updatedUser });

        } catch (error) {
            console.log("Error", error);
            next(error)
        }
    }
)

router.get('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin']),
    async (req, res, next) => {
        try {
            const users = await UsersController.get();

            let usersDTO = [];

            users.forEach((user) => {
                usersDTO.push(new UsersDTO(user))
            })

            // console.log("userDTO", userDTO)
            return res.status(200).json({ users: usersDTO })
        } catch (error) {
            console.log('Error', error.message)
            next(error)
        }
    }
)


router.delete('/',
    passport.authenticate('jwt', { session: false }),
    authorizationMiddleware(['admin']),
    async (req, res, next) => {
        try {

        } catch (error) {
            console.log('Error', error.message);
            next(error);
        }
    }
)

export default router;
