
import {  ObjectSchema } from 'joi'
import {ApiError} from '../utils/ApiError.js'
import {Request,Response,NextFunction} from 'express'


export const validate = (schema:ObjectSchema) => (req:Request,res:Response,next:NextFunction):void=>{
    const {error,value} = schema.validate(req.body,{
        abortEarly:false,
        stripUnknown:true
    })
    if(error){
        const errorMessages = error.details.map((detail)=>detail.message)
        return next(new ApiError(400,"Validation failed",errorMessages))
    }
    req.body=value
    next()
}