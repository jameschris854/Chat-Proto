import { Date,ObjectId } from "mongoose";

export interface IUserFriends {
    _id: ObjectId
    name: string
    mobileNo: number
    email: string
    lastSeen: Date
    createdAt: Date
    updatedAt: Date,
    __v: 0
}

export default interface IUserDoc {
    id:ObjectId;
    _id:ObjectId;
    email: string;
    password: string;
    name: string;
    friends: Array<IUserFriends>;
    lastSeen: any;
    passwordConfirm: string;
    active: boolean;
    authToken?: string ;
    photo?: string ;
    passwordChangedAt?: Date ;
}