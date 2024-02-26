import UserDTO from "../dto/user.dto.js"

export default class User {
    constructor(dao) {
        this.dao = dao;
    }

    async get(filter = {}) {
        // console.log("this.dao", this.dao.get())
        const users = await this.dao.get(filter)
        // console.log("users", users)
        // return users.map(user => new UserDTO(user))
        return users //this.dao.get(filter)
    }

    create(data) {
        return this.dao.create(data)
    }

    updateById(id, data) {
        return this.dao.updateById(id, data)
    }

    deleteById(id) {
        return this.dao.deleteById(id)
    }

    getById(id) {
        return this.dao.getById(id)
    }

    updateDocument(id, data) {
        return this.dao.updateDocument(id, data)
    }

    async getCurrent(id) {
        // console.log("id", id);
        let currentUser = await this.dao.getById(id);

        if (!currentUser) {
            return { error: "Usuario no encontrado" };
        }

        currentUser = new UserDTO(currentUser);
        // console.log("Current user en getCurrent", currentUser);

        return currentUser.rol === 'admin' ?
            {
                id: currentUser.id.toString(),
                firstName: currentUser.first_name,
                lastName: currentUser.last_name,
                email: currentUser.email,
                rol: currentUser.rol,
            } : {
                id: currentUser.id.toString(),
                firstName: currentUser.first_name,
                lastName: currentUser.last_name,
                email: currentUser.email,
                rol: currentUser.rol,
                cartId: currentUser.cartId,
                documents: currentUser.documents,
            }
    }

}