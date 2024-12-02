import { Router } from "express";
import { getFileByName, getImageByid } from "../controllers/imagecontroller";
const routes = Router();
routes.get("/:id", getImageByid);
routes.get("/file/:filename", getFileByName);

export default routes;
