
import {Document,Types} from 'mongoose'

export interface IUser{
    name:string,
    email:string,
    password:string,
    createdAt?:Date,
    updatedAt?:Date
}

export interface IUserDocument extends IUser,Document{
    _id:Types.ObjectId
}


export interface ICreateUserInput{
name:string,
email:string,
password?:string
}

export interface ISafeUser{
    _id:Types.ObjectId | string,
    name:string,
    email:string
}