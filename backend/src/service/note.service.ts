import sanitizeHtml from "sanitize-html";
import { FilterQuery, SortOrder } from "mongoose";
import {
  createNoteInDB,
  deleteNoteByIdAndUser,
  findNoteByIdAndUser,
  findNotesAndCount,
  updateNoteByIdAndUser,
} from "../dal/note.dal.js";
import {
  ICreateNoteInput,
  IGetNotesInput,
  INoteDocument,
  IPaginatedNotesResult,
  IUpdateNoteInput,
  UpdateNoteBodyDto,
} from "../types/note.types.js";
import { ApiError } from "../utils/ApiError.js";
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "hr",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "a",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};
const sanitizeContent = (rawHtml: string): string => {
  return sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
};
const normalizeTags = (tags: string[]): string[] => {
  const cleaned = tags
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);
  return [...new Set(cleaned)];
};
const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const createNote=async(input:ICreateNoteInput,):Promise<INoteDocument>=>{
    const content=sanitizeContent(input.content)
    if(!content.trim()){
        throw new ApiError(400,
            "Note Content cannot be empty or contain only unsafe html"
        )

    }
    const normalizeTag = normalizeTags(input.tags??[])
    return await createNoteInDB({
        userId:input.userId,
        title:input.title,
        content,
        tags:normalizeTag,
        isPinned:input.isPinned ?? false
    })
}
export const getNotes=async({
    userId,query}:IGetNotesInput
):Promise<IPaginatedNotesResult>=>{
    const {page,limit,search,tag,isPinned,isArchived,sortBy,orderBy}=query
    const filter:FilterQuery<INoteDocument>={
      userId,
      isArchived:isArchived??false
    }
    if(isPinned!==undefined){
      filter.isPinned=isPinned
    }
    if(tag && tag.trim().length>0){
      filter.tags=tag.trim().toLowerCase()
    }
    if(search && search.trim().length>0){
      const safeSearch = escapeRegex(search.trim())
      filter.$or=[{title:{$regex:safeSearch,$options:'i'}},
        {content:{$regex:safeSearch,$options:'i'}}
      ]
    }
    const sortDirection :SortOrder=orderBy==='asc'?1:-1
    const sort:Record<string,SortOrder>={
      isPinned:-1,
      [sortBy]:sortDirection
    }
    const skip=(page-1)*limit
    const {notes,totalCount}= await findNotesAndCount(
      filter,
      sort,
      skip,
      limit
    )
    const totalPages = totalCount ===0?0:Math.ceil(totalCount/limit)
    return {
      notes,
      pagination:{
        totalCount,
        totalPages,
        currentPage:page,
        limit,
        hasNextPage:page<totalPages,
        hasPrevPage:page>1
      }
    }
}
export const getNoteById=async(noteId:string,
  userId:string
):Promise<INoteDocument>=>{
  const note = await findNoteByIdAndUser(noteId,userId)
  if(!note){
    throw new ApiError(404,"Note not found")
  }
  return note
}

export const updateNote=async({
  noteId,
  userId,
  updateData
}:IUpdateNoteInput):Promise<INoteDocument>=>{
  const sanitizedUpdate:UpdateNoteBodyDto={...updateData}
  if(updateData.content!==undefined){
    const cleanedContent=sanitizeContent(updateData.content)
    if(!cleanedContent.trim()){
      throw new ApiError(400,"Note content cannot be empty or contain only unsafe HTML")
    }
    sanitizedUpdate.content=cleanedContent
  }
  if(updateData.tags !==undefined){
    sanitizedUpdate.tags=normalizeTags(updateData.tags)
  }
  const updatedNote= await updateNoteByIdAndUser(
    noteId,
    userId,
    sanitizedUpdate
  )
  if(!updatedNote){
    throw new ApiError(404,"Note not found")
  }
 return updatedNote
}

export const deleteNote=async(noteId:string,userId:string):Promise<void>=>{
  const deletedNote= await deleteNoteByIdAndUser(noteId,userId)
  if(!deletedNote){
    throw new ApiError(404,"Note not found")
  }
}