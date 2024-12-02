import { Router } from "express";
import {
  createSearch,
  findPopularSearches,
  getRecentSearches,
} from "../controllers/searchController";
const routes = Router();

routes.post("/", createSearch);
routes.get("/", getRecentSearches);
routes.get("/popular", findPopularSearches);

export default routes;
