export default class UserDTO {
    constructor(user) {
        this.id = user._id;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.email = user.email;
        this.rol = user.rol;
        this.cartId = user.cartId;
        this.documents = user.documents;
    }


}