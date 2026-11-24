import {Document,Types} from "mongoose";

export interface ISession{
    userId:Types.ObjectId | string,
    refreshToken:string,
    ip:string,
    userAgent:string,
    isRevoked:boolean,
    expiresAt:Date,
    createdAt?:Date,
    updatedAt?:Date
}

export interface ISessionDocument extends Document,ISession{
    _id:Types.ObjectId
}

export interface ISessionInput{
    _id?:Types.ObjectId |string,
    userId:Types.ObjectId | string,
    refreshToken:string,
    ip:string,
    userAgent:string,
    expiresAt:Date
}
