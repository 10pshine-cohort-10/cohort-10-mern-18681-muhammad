import { Router } from "express";
import { authValidate } from "../middleware/auth.middleware.js";
import {
  validate,
  validateParams,
  validateQuery,
} from "../middleware/validate.middleware.js";
import {
  createNoteValidation,
  noteParamsValidation,
  noteQueryValidation,
  updateNoteValidation,
} from "../validation/note.validation.js";
import {
  createNoteHandler,
  deleteNoteHandler,
  getNoteByIdHandler,
  getNotesHandler,
  updateNoteHandler,
} from "../controller/note.controller.js";

const route: Router = Router();

route.use(authValidate);

route.post("/", validate(createNoteValidation), createNoteHandler);
route.get("/", validateQuery(noteQueryValidation), getNotesHandler);
route.get("/:noteId", validateParams(noteParamsValidation), getNoteByIdHandler);
route.patch(
  "/:noteId",
  validateParams(noteParamsValidation),
  validate(updateNoteValidation),
  updateNoteHandler,
);
route.delete("/:noteId", validateParams(noteParamsValidation), deleteNoteHandler);

export default route;
