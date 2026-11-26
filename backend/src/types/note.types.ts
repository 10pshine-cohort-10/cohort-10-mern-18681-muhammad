
import {Document,Types} from 'mongoose'

export interface INote{
    userId:Types.ObjectId|string,
    title:string,
    content:string,
    tags:string[],
    isPinned:boolean,
    isArchived:boolean,
    createdAt?:Date,
    updatedAt?:Date
}

export interface INoteDocument extends Document,INote{
    _id:Types.ObjectId
}


export interface CreateNoteBodyDto{
    title:string,
    content:string,
    tags?:string[],
    isPinned?:boolean
}

export interface UpdateNoteBodyDto{
    title?:string,
    content?:string,
    tags?:string[],
    isPinned?:boolean,
    isArchived?:boolean
}

export type NoteParamsDto = {
    noteId:string
}

export type NoteSortField = 'createdAt' |'updatedAt' | 'title'
export type NoteSortOrder='asc' | 'desc'

export interface noteQueryDto{
    page:number,
    limit:number,
    search?:string,
    tag?:string,
    isPinned?:boolean,
    isArchived?:boolean,
    sortBy:NoteSortField,
    orderBy:NoteSortOrder
}


export interface ICreateNoteInput extends CreateNoteBodyDto{
    userId:string
}

export interface IUpdateNoteInput{
    noteId:string,
    userId:string,
    updateData:UpdateNoteBodyDto
}


export interface IGetNotesInput{
    userId:string,
    query:noteQueryDto
}

export interface IPaginationMeta {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}
export interface IPaginatedNotesResult {
  notes: INoteDocument[];
  pagination: IPaginationMeta;
}