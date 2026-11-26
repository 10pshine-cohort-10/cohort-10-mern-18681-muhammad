import joi, { ObjectSchema } from "joi";
import {
  CreateNoteBodyDto,
  NoteParamsDto,
  noteQueryDto,
  UpdateNoteBodyDto,
} from "../types/note.types.js";

export const createNoteValidation: ObjectSchema<CreateNoteBodyDto> = joi
  .object<CreateNoteBodyDto>({
    title: joi.string().trim().min(1).max(100).required().messages({
      "string.empty": "Title is required",
      "string.max": "Title cannot exceed 100 characters",
      "any.required": "Title is required",
    }),
    content: joi.string().min(1).max(50000).required().messages({
      "string.empty": "Content is required",
      "string.max": "Content cannot exceed 50,000 characters",
      "any.required": "Content is required",
    }),
    tags: joi
      .array()
      .items(joi.string().trim().min(1).max(30))
      .max(10)
      .default([])
      .messages({
        "array.max": "A note can have at most 10 tags",
        "string.max": "Each tag cannot exceed 30 characters",
      }),
    isPinned: joi.boolean().default(false),
  })
  .required();

export const updateNoteValidation: ObjectSchema<UpdateNoteBodyDto> = joi
  .object<UpdateNoteBodyDto>({
    title: joi.string().trim().min(1).max(100).messages({
      "string.empty": "Title cannot be empty",
      "string.max": "Title cannot exceed 100 characters",
    }),
    content: joi.string().min(1).max(50000).messages({
      "string.empty": "Content cannot be empty",
      "string.max": "Content cannot exceed 50,000 characters",
    }),
    tags: joi
      .array()
      .items(joi.string().trim().min(1).max(30))
      .max(10)
      .messages({
        "array.max": "A note can have at most 10 tags",
        "string.max": "Each tag cannot exceed 30 characters",
      }),
    isPinned: joi.boolean(),
    isArchived: joi.boolean(),
  })
  .min(1)
  .required()
  .messages({
    "object.min": "At least one field must be provided to update a note",
  });

export const noteParamsValidation: ObjectSchema<NoteParamsDto> = joi
  .object<NoteParamsDto>({
    noteId: joi.string().hex().length(24).required().messages({
      "string.hex": "Invalid note ID format",
      "string.length": "Invalid note ID length",
      "any.required": "Note ID is required",
    }),
  })
  .required();

export const noteQueryValidation: ObjectSchema<noteQueryDto> = joi
  .object<noteQueryDto>({
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().integer().min(1).max(50).default(10),
    search: joi.string().trim().max(100).allow(""),
    tag: joi.string().trim().max(30).allow(""),
    isPinned: joi.boolean(),
    isArchived: joi.boolean().default(false),
    sortBy: joi
      .string()
      .valid("createdAt", "updatedAt", "title")
      .default("updatedAt"),
    orderBy: joi.string().valid("asc", "desc").default("desc"),
  })
  .required();