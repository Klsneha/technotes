import { Router } from "express";
import { noteController } from "../Controllers/noteController";
export const router = Router();
import { verifyJWT } from "../middleware/verifyJWT";

router.use(verifyJWT); // Apply JWT verification middleware to all routes in this router
router.route("/")
  .get(noteController.listAllNotes)
  .get(noteController.listNotes)
  .get(noteController.getNote)
  .post(noteController.createNewNote)
  .patch(noteController.editNote)
  .delete(noteController.deleteNote);

