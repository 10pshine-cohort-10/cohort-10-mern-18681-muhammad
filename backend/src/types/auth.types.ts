import { ISafeUser } from "./user.types.js"


export interface IRegisterInput{
    name:string,
    email:string,
    password:string,
    ip:string,
    userAgent:string
}

export interface ILoginInput{
    email:string,
    password:string,
    ip:string,
    userAgent:string
}

export interface IAuthResult{
    user:ISafeUser,
    refreshToken:string,
    accessToken:string
}

export interface IAccessTokenPayload{
    id:string,
    email:string
}
export interface IRefreshTokenPayload{
    id:string,
    email:string,
    sessionId:string
}