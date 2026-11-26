import { Request, Response, NextFunction } from "express";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "../service/note.service.js";
import {
  CreateNoteBodyDto,
  NoteParamsDto,
  noteQueryDto,
  UpdateNoteBodyDto,
} from "../types/note.types.js";
import { ApiError } from "../utils/ApiError.js";

const getAuthenticatedUserId = (req: {
  user?: Express.Request["user"];
}): string => {
  if (!req.user?._id) {
    throw new ApiError(401, "Unauthorized access");
  }
  return req.user._id.toString();
};

export const createNoteHandler = async (
  req: Request<{}, {}, CreateNoteBodyDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { title, content, tags, isPinned } = req.body;

    const note = await createNote({
      userId,
      title,
      content,
      tags,
      isPinned,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: { note },
    });
  } catch (error) {
    next(error);
  }
};

export const getNotesHandler = async (
  req: Request,
  res: Response<unknown, { validatedQuery: noteQueryDto }>,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const query = res.locals.validatedQuery;

    const result = await getNotes({ userId, query });

    res.status(200).json({
      success: true,
      message: "Notes fetched successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getNoteByIdHandler = async (
  req: Request<NoteParamsDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { noteId } = req.params;

    const note = await getNoteById(noteId, userId);

    res.status(200).json({
      success: true,
      message: "Note fetched successfully",
      data: { note },
    });
  } catch (error) {
    next(error);
  }
};

export const updateNoteHandler = async (
  req: Request<NoteParamsDto, {}, UpdateNoteBodyDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { noteId } = req.params;

    const note = await updateNote({
      noteId,
      userId,
      updateData: req.body,
    });

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: { note },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNoteHandler = async (
  req: Request<NoteParamsDto>,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { noteId } = req.params;

    await deleteNote(noteId, userId);

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
