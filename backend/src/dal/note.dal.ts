import { FilterQuery, SortOrder } from "mongoose";
import noteModel from "../model/Note.model.js";
import { ICreateNoteInput, INoteDocument, UpdateNoteBodyDto } from "../types/note.types.js";







export const createNoteInDB=async(noteData:ICreateNoteInput):Promise<INoteDocument>=>{
    try {
        return await noteModel.create(noteData)
    } catch (error) {
        throw error
    }
}

export const findNotesAndCount=async(filter:FilterQuery<INoteDocument>,sort:Record<string,SortOrder>,skip:number,limit:number):Promise<{notes:INoteDocument[],totalCount:number
}>=>{
    try {
        const [notes,totalCount] = await Promise.all([
            noteModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),noteModel.countDocuments(filter).exec()
        ])
        return { notes,totalCount}
    } catch (error) {
        throw error
    }
}

export const findNoteByIdAndUser = async(noteId:string,
    userId:string
):Promise<INoteDocument | null>=>{
    try {
        return await noteModel.findOne({_id:noteId,userId})
    } catch (error) {
        throw error
    }
}
export const updateNoteByIdAndUser=async(noteId:string,userId:string,updateData:UpdateNoteBodyDto):Promise<INoteDocument|null>=>{
    try {
        return await noteModel.findOneAndUpdate(
            {_id:noteId,userId},{
                $set:updateData
            },
            {new:true,runValidators:true}
        )
    } catch (error) {
        throw error
    }
}
export const deleteNoteByIdAndUser=async(noteId:string,
    userId:string
):Promise<INoteDocument|null>=>{
    try {
        return await noteModel.findOneAndDelete({_id:noteId,userId})
    } catch (error) {
        throw error
    }
}