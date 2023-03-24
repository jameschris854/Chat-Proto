import Users from "../Model/userModel"

export const getUserById = async (userId: string) => {
    return await Users.findById(userId) 
}