import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { sendError } from "./errorHanlder";
import userModel from "../models/userModel";
import { authErrors, userErrors } from "../utils/Errors/commonErrors";
const secretKey = process.env.JWTSECRETKEY || "secret";

export async function veriifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log(req.files);
    const jwtToken = req.headers["authorization"];
    if (!jwtToken) {
      sendError(res, authErrors.PROVIDE_TOKEN);
      return;
    }

    jwt.verify(jwtToken, secretKey as string, async (error, payload) => {
      if (error) {
        sendError(res, authErrors.INVALID_TOKEN);
        return;
      }
      let id = (payload as JwtPayload).id;
      const user = await userModel.findById(id);
      if (!user) {
        sendError(res, userErrors.USER_NOT_FOUND);
        return;
      }
      req.user = user;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
    return;
  }
}

export async function verified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (user.verified === true) {
    next();
    return;
  }
  return sendError(res, userErrors.USER_NOT_VERIFIED);
}

export async function isUserActive(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const user = req.user;
  if (user.isActive === false || user.removed === true) {
    sendError(res, userErrors.USER_NOT_ACTIVE);
    return;
  }
  next();
  return;
}
