import { Request, Response, NextFunction } from "express";
import { sendError } from "../middlewares/errorHanlder";
import { errors } from "../middlewares/errorHanlder";
import { validEmail, isString, isAlphaNum } from "../utils/validationutils";

export function loginValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { country_code, mobile_no, password, role } = req.body;

  const phoneRegex = /^\d{10}$/;
  const Error: errors = [];

  if (!country_code) Error.push({ error: "country_code field is empty" });
  if (!mobile_no) Error.push({ error: "Phone number field is empty" });
  if (!password) Error.push({ error: "password field is empty" });
  if (!role) Error.push({ error: "role field is empty" });
  if (mobile_no && !isString(mobile_no)) {
    Error.push({ error: "mobile_no is not a string" });
  }
  if (mobile_no && !phoneRegex.test(mobile_no)) {
    Error.push({ error: "Invalid phone number format" });
  }

  if (password && !isString(password)) {
    Error.push({ error: "password is not a string" });
  }

  if (country_code && !isAlphaNum(country_code)) {
    Error.push({ error: "country_code is not a valid code" });
  }

  if (Error.length > 0) {
    sendError(res, Error, 400);
    return;
  }
  next();
}

export function signUpValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, email, password, country_code, mobile_no, state } = req.body;

  const phoneRegex = /^\d{10}$/;

  const Error: errors = [];

  if (!name) Error.push({ error: "Name field is empty" });
  if (!email) Error.push({ error: "Email field is empty" });
  if (!mobile_no) Error.push({ error: "Phone number field is empty" });
  if (!password) Error.push({ error: "password field is empty" });
  if (!state) Error.push({ error: "state field is empty" });
  if (!country_code) Error.push({ error: "country_code field is empty" });

  if (name && !isString(name)) Error.push({ error: "name is not a string" });
  if (email && !isString(email)) Error.push({ error: "email is not a string" });
  if (mobile_no && !isString(mobile_no))
    Error.push({ error: "phone number is not a string" });
  if (password && !isString(password))
    Error.push({ error: "password is not a string" });
  if (password && password.length < 4) {
    Error.push({ error: "Please Provide Strong Password" });
  }

  if (email && isString(email) && !validEmail(email)) {
    Error.push({ error: "Invalid email format" });
  }

  if (mobile_no && !phoneRegex.test(mobile_no)) {
    Error.push({ error: "Invalid phone number format" });
  }

  if (password && password.length < 4) {
    Error.push({ error: "Password at least contain 5 letters" });
  }
  if (country_code && !isAlphaNum(country_code)) {
    Error.push({ error: "country_code is not a valid number" });
  }

  if (Error && Error.length > 0) {
    sendError(res, Error, 400);
    return;
  }
  next();
}

export function sendotpValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { mobile_no, country_code } = req.body;
  const phoneRegex = /^\d{10}$/;
  let Error: errors = [];

  // if (email && !isString(email)) {
  //   Error.push({ error: "email is not a string" });
  // }
  // if (email && !validEmail(email)) {
  //   Error.push({ error: "Invalid email format" });
  // }

  if (!mobile_no) {
    Error.push({ error: "mobile_no field is empty" });
  }
  if (!country_code) {
    Error.push({ error: "country_code field is empty" });
  }

  if (mobile_no && !isString(mobile_no)) {
    Error.push({ error: "mobile_no is not a string" });
  }

  if (mobile_no && !phoneRegex.test(mobile_no)) {
    Error.push({ error: "Invalid phone number format" });
  }

  if (country_code && !isAlphaNum(country_code)) {
    Error.push({ error: "country_code is not a valid code" });
  }

  if (Error && Error.length > 0) {
    sendError(res, Error, 400);
    return;
  }
  next();
}

export function verifyOtpValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { otp, mobile_no, country_code } = req.body;
  const phoneRegex = /^\d{10}$/;
  let Error: errors = [];

  if (!otp) {
    Error.push({ error: "otp field is empty" });
  }

  if (!mobile_no) {
    Error.push({ error: "mobile_no field is empty" });
  }
  if (!country_code) {
    Error.push({ error: "country_code field is empty" });
  }

  if (country_code && !isAlphaNum(country_code)) {
    Error.push({ error: "country_code is not a valid code" });
  }
  if (mobile_no && !isString(mobile_no)) {
    Error.push({ error: "mobile_no is not a string" });
  }

  if (mobile_no && !phoneRegex.test(mobile_no)) {
    Error.push({ error: "Invalid phone number format" });
  }
  if (otp && !isString(otp)) Error.push({ error: "otp is not a string" });

  if (Error && Error.length > 0) {
    sendError(res, Error, 400);
    return;
  }

  next();
}

export function updateUserValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const {
    name,
    mobile_no,
    email,
    country_code,
    oldPassword,
    newPassword,
    confirmPassword,
  } = req.body;

  const phoneRegex = /^\d{10}$/;
  const Errors: { error: string }[] = [];

  if (email && typeof email !== "string")
    Errors.push({ error: "Email must be a string" });
  if (name && typeof name !== "string")
    Errors.push({ error: "Name must be a string" });
  if (mobile_no && typeof mobile_no !== "string")
    Errors.push({ error: "Mobile number must be a string" });
  if (country_code && typeof country_code !== "string")
    Errors.push({ error: "Country code must be a string" });
  if (oldPassword && typeof oldPassword !== "string")
    Errors.push({ error: "Old password must be a string" });
  if (newPassword && typeof newPassword !== "string")
    Errors.push({ error: "New password must be a string" });
  if (confirmPassword && typeof confirmPassword !== "string")
    Errors.push({ error: "Confirm password must be a string" });

  if (email && !validEmail(email))
    Errors.push({ error: "Invalid email format" });

  if (mobile_no && !phoneRegex.test(mobile_no)) {
    Errors.push({ error: "Mobile number must be a 10-digit number" });
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    Errors.push({ error: "New password and confirm password do not match" });
  }

  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
}

export function setNewPasswordValidator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { mobile_no, newPassword, confirmPassword } = req.body;

  const phoneRegex = /^\d{10}$/;
  const Errors: { error: string }[] = [];

  if (newPassword && !isString(newPassword))
    Errors.push({ error: "New password must be a string" });
  if (confirmPassword && !isString(confirmPassword))
    Errors.push({ error: "Confirm password must be a string" });

  if (mobile_no && !phoneRegex.test(mobile_no)) {
    Errors.push({ error: "Mobile number must be a 10-digit number" });
  }

  if (newPassword && confirmPassword && newPassword !== confirmPassword) {
    Errors.push({ error: "New password and confirm password do not match" });
  }

  if (Errors.length > 0) {
    sendError(res, Errors, 400);
    return;
  }

  next();
}
