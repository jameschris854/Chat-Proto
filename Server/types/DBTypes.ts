import { ObjectId } from "mongoose";

export default interface IUserDoc {
    id:ObjectId;
    _id:ObjectId;
    email: string;
    password: string;
    name: string;
    friends: any[];
    lastSeen: any;
    passwordConfirm: string;
    active: boolean;
    authToken?: string ;
    photo?: string ;
    passwordChangedAt?: Date ;
}