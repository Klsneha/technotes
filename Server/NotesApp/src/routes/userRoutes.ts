import { Router } from "express";
export const router = Router();
import { userController } from "../Controllers/userController";

import { verifyJWT } from "../middleware/verifyJWT";

router.use(verifyJWT); // Apply JWT verification middleware to all routes in this router
router.route("/")
  .get(userController.listUsers)
  .post(userController.createNewUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

