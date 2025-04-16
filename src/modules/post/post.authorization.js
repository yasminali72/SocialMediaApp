import { roleTypes } from "../../DB/model/User.model.js";

export const endPoint={
    createPost:[roleTypes.user],
    freezePost:[roleTypes.admin,roleTypes.user]
}