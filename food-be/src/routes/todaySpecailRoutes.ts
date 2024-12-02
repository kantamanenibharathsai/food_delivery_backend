import Router from "express";
import {
  createTodaySpecial,
  getAllTodaySpecials,
  getTodaySpecials,
  removeTodaySpecial,
} from "../controllers/todaySpecialController";
import verifyRole from "../middlewares/verifyRole";

const routes = Router();
routes.post("/", verifyRole(["ADMIN", "SELLER"]), createTodaySpecial);
routes.get("/", getAllTodaySpecials);
routes.get("/business/:id", getTodaySpecials);
routes.delete("/:id", verifyRole(["ADMIN", "SELLER"]), removeTodaySpecial);
// routes.put("/:id", verifyRole(["ADMIN", "SELLER"]), removeTodaySpecial);

export default routes;
