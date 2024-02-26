import UserModel from "../models/user.model.js";

export default class UserDao {
    get(criteria = {}) {
        return UserModel.find(criteria)
    }

    create(data) {
        // console.log("data", data)
        return UserModel.create(data)
    }

    getById(uid) {
        return UserModel.findById(uid);
    }

    updateById(uid, data) {
        console.log("data", data)
        return UserModel.updateOne({ _id: uid }, { $set: data })
    }

    deleteById(uid) {
        return UserModel.deleteOne({ _id: uid })
    }

    async updateDocument(uid, data) {
        const allowedDocumentTypes = ['Id', 'address', 'accountStatus'];
        const documentType = data.documentType;

        if (!allowedDocumentTypes.includes(documentType)) {
            throw new Error(`Invalid documentType: ${documentType}`);
        }

        try {
            return UserModel.updateOne(
                { _id: uid },
                { $push: { documents: data } }
            );

            // return updatedUser;
        } catch (error) {
            console.error('Error updating document:', error.message);
            throw error;
        }
    }

    // updateDocument(uid, data) {

    //     console.log("data", data)
    //     return UserModel.updateOne({ _id: uid }, { $push: { documents: data } }, { new: true });
    // }
}