import { Router } from "express";
import {
  createBestChoice,
  removeBestchoice,
  getRestaurentBestChoices,
  getAllBestChoices,
} from "../controllers/bestChoiceController";
import { validateCreateBestChoice } from "../validators/bestChoiceValidators";

const routes = Router();
import multer from "multer";
const upload = multer();

routes.get("/business/:id", getRestaurentBestChoices);
routes.post(
  "/",
  upload.array("image"),
  validateCreateBestChoice,
  createBestChoice
);
routes.delete("/:id", removeBestchoice);
routes.get("/best-choice", getAllBestChoices);

export default routes;
