import { Router } from "express";
import {
  login,
  sendOtp,
  setNewPassword,
  signUp,
  updateUser,
  VerifyOtp,
} from "../controllers/userControllers";
import {
  loginValidator,
  sendotpValidator,
  setNewPasswordValidator,
  signUpValidator,
  updateUserValidator,
  verifyOtpValidator,
} from "../validators/userValidator";
const routes = Router();
import multer = require("multer");
import { veriifyUser } from "../middlewares/authMiddleware";
const upload = multer();

routes.post("/signUp", signUpValidator, signUp);
routes.post("/login", loginValidator, login);
routes.post("/sendOtp", sendotpValidator, sendOtp);
routes.post("/verifyOtp", verifyOtpValidator, VerifyOtp);
routes.put(
  "/update",
  veriifyUser,
  upload.array("files"),
  updateUserValidator,
  updateUser
);
routes.post("/updatePassword", setNewPasswordValidator, setNewPassword);

export default routes;
