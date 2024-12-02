import { Request, Response } from "express";
import userModel from "../models/userModel";
import bcrypt from "bcrypt";
import logger from "../loggers/logger";
import { sendError } from "../middlewares/errorHanlder";
import { userErrors, authErrors } from "../utils/Errors/commonErrors";
import { generateJwtToken } from "../libraries/userlib";
import transporter from "../config/nodemailer";
import { userMessages } from "../utils/successMessages/successMessages";
import client from "../config/twilioConfig";
import mongoose from "mongoose";
import { uploadFiles } from "../libraries/minioLib";

export async function signUp(req: Request, res: Response) {
  /*#swagger.tags=['Users']
  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                name: "string",
                mobile_no:"string",
                email: "string",
                password:"string",
                country_code:"string",
                state:"string",
                role:"string"
            }
    } */
  try {
    let { name, email, password, country_code, mobile_no, state, role } =
      req.body;
    email = email.toLowerCase();
    console.log(email);
    const user = await userModel.findOne({
      $or: [{ mobile_no: mobile_no }, { email: email }],
    });
    console.log(user);
    if (user) {
      if (user.email === email) {
        sendError(res, { error: "User Already Exists with this email" });
        return;
      } else if (user.mobile_no == mobile_no) {
        sendError(res, { error: "Mobile number Already Exists" });
        return;
      }
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      name,
      email,
      mobile_no,
      password: hashedPassword,
      country_code,
      state,
      role,
    });
    const updatedUser = await userModel.findOne({ _id: newUser._id });

    res.status(201).json({
      user: {
        name: updatedUser?.name,
        email: updatedUser?.email,
        mobile_no: updatedUser?.mobile_no,
        country_code: user?.country_code,
        id: updatedUser?.id,
      },

    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}

export async function login(req: Request, res: Response) {
  /*#swagger.tags=['Users']
  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                mobile_no: "string",
                password: "string",
                role: "string",
                country_code: "string",
            }
    } */
  try {
    const { country_code, mobile_no, password, role } = req.body;

    const user = await userModel
      .findOne({ $and: [{ country_code }, { mobile_no }] })
      .select("+password");

    if (!user) {
      sendError(res, { error: "User not registered" });
      return;
    }
    if (user.role !== role) {
      sendError(res, { error: "you don't have permission" });
      return;
    }

    if (user.removed || !user.isActive) {
      sendError(res, { error: "User not active" });
      return;
    }

    if (!user.verified) {
      sendError(res, { error: "User not verified" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      logger.info(`${authErrors.INCORRECT_PASSWORD.error} ${req.originalUrl}`);
      sendError(res, authErrors.INCORRECT_PASSWORD);
      return;
    }

    const jwtToken = generateJwtToken({ id: user._id });

    const updatedUser = await userModel.findById(user._id);

    res.status(200).json({
      data: {
        status: 200,
        jwtToken,
        user: {
          id: updatedUser?.id,
          email: updatedUser?.email,
          mobile_no: updatedUser?.mobile_no,
          full_name: updatedUser?.name,
          role: updatedUser?.role,
          businessId: updatedUser?.businessId
        },
      },
    });
  } catch (error: any) {
    logger.error(`${JSON.stringify(error)} ${req.originalUrl}`);
    res.status(500).json({ error: error.message });
  }
}

export async function sendOtp(req: Request, res: Response) {
  /*#swagger.tags=['Users']
  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                mobile_no:"string",
                country_code:"string",
            }
    } */
  try {
    const { mobile_no, country_code } = req.body;

    const user = await userModel.findOne({
      $and: [{ country_code }, { mobile_no }],
    });
    if (!user) {
      logger.error(userErrors.USER_NOT_FOUND + req.originalUrl);
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }

    const otp = Math.ceil(Math.random() * 8000 + 1000).toString();
    user.verify_otp = otp;
    user.verify_otp_time = new Date();

    // await client.messages.create({
    //   from: process.env.TwilioNumber,
    //   to: (country_code || "+91") + mobile_no,
    //   body: `OTP Verification: ${otp}`,
    // });

    await user.save();

    if (process.env.NODE_ENV === "dev") {
      res.status(200).json({
        data: {
          status: 200,
          message: "OTP sent successfully",
          otp: otp,
        },
      });
      return;
    }

    logger.info("OTP sent successfully to user" + req.originalUrl);
    res.status(200).json({
      data: { status: 200, message: "OTP sent successfully", otp: otp },
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function VerifyOtp(req: Request, res: Response) {
  /*#swagger.tags=['Users']
  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                country_code:"string",
                mobile_no:"string",
                otp:"string"
            }
    } */
  try {
    const { otp, mobile_no, country_code } = req.body;
    const user = await userModel.findOne({
      $and: [{ country_code }, { mobile_no }],
    });
    if (!user) {
      logger.info(userErrors.USER_NOT_FOUND + req.originalUrl);
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }

    if (user.verify_otp == "") {
      logger.info(userErrors.INVALID_OTP + req.originalUrl);
      sendError(res, userErrors.INVALID_OTP);
      return;
    }
    const currentTime = new Date().getTime();
    let timerange = 1 * 1000 * 60;
    const expiresIn =
      user.verify_otp_time && user.verify_otp_time?.getTime() + timerange;
    let isValid;
    if (expiresIn !== undefined && currentTime > expiresIn) {
      logger.info(userErrors.OTP_EXPIRED + req.originalUrl);
      sendError(res, userErrors.OTP_EXPIRED);
      return;
    }

    isValid = user.verify_otp === otp;
    if (!isValid) {
      logger.info(userErrors.INCORRECT_OTP.error + req.originalUrl);
      sendError(res, userErrors.INCORRECT_OTP);
      return;
    }

    user.verified = true;
    await user.save();
    logger.info(userMessages.VERIFY_OTP_SUCCESS.message + req.originalUrl);
    res
      .status(200)
      .json({ data: { status: 200, message: "OTP verified Successfully" } });
    return;
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

export async function updateUser(req: Request, res: Response) {
  /* 
  #swagger.tags = ['Users']
  #swagger.parameters['authorization'] = {
    in: 'header',
    required: true
  }
  #swagger.summary = 'Update User'
  #swagger.parameters['files'] = {
    in: 'formData',
    required: false,
    type: 'file',
    format: 'binary'
  }
  #swagger.parameters['name'] = {
    in: 'formData',
    required: false,
    type: 'string'
  }
  #swagger.parameters['email'] = {
    in: 'formData',
    required: false,
    type: 'string'
  }
  #swagger.parameters['mobile_no'] = {
    in: 'formData',
    required: false,
    type: 'string'
  }
  #swagger.parameters['country_code'] = {
    in: 'formData',
    required: false,
    type: 'string'
  }
  #swagger.parameters['oldPassword'] = {
    in: 'formData',
    required: false,
    type: 'string'
  }
  #swagger.parameters['newPassword'] = {
    in: 'formData',
    required: false,
    type: 'string'
  }
  #swagger.parameters['confirmPassword'] = {
    in: 'formData',
    required: false,
    type: 'string'
  }
*/

  try {
    const {
      name,
      mobile_no,
      email,
      country_code,
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    const user = await userModel.findOne({ _id: req.user._id });
    if (!user) {
      logger.error(userErrors.USER_NOT_FOUND.error + req.originalUrl);
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      logger.error(userErrors.PASSWORD_MISSMATCH.error + req.originalUrl);
      sendError(res, userErrors.PASSWORD_MISSMATCH);
      return;
    }
    let image: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      image = await uploadFiles(req.files);
    }

    user.profile_url = image[0] || user.profile_url;
    user.name = name || user.name;
    user.email = email || user.email;
    user.mobile_no = mobile_no || user.mobile_no;
    user.country_code = country_code || user.country_code;

    if (oldPassword && newPassword && confirmPassword) {
      const isValidPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isValidPassword) {
        logger.error(userErrors.INCORRECT_OLD_PASSWORD.error + req.originalUrl);
        sendError(res, userErrors.INCORRECT_OLD_PASSWORD);
        return;
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
    }

    await user.save();

    const updatedUser = await userModel
      .findOne({ _id: user._id })
      .select("+password");
    logger.info(
      userMessages.USER_PROFILE_UPDATE_SUCCESS.message + req.originalUrl
    );

    res.status(200).json({ data: updatedUser });
  } catch (error: any) {
    logger.error("Error updating user: " + error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function setNewPassword(req: Request, res: Response) {
  /*#swagger.tags=['Users']
  #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                country_code:"string",
                mobile_no:"string",
                newPassword:"string",
                confirmPassword:"string",
            }
    } */
  try {
    const { country_code, mobile_no, newPassword, confirmPassword } = req.body;
    const user = await userModel.findOne({
      $and: [{ country_code }, { mobile_no }],
    });
    if (!user) {
      logger.error(userErrors.USER_NOT_FOUND.error + req.originalUrl);
      sendError(res, userErrors.USER_NOT_FOUND);
      return;
    }
    if (newPassword !== confirmPassword) {
      logger.error(userErrors.PASSWORD_MISSMATCH.error + req.originalUrl);
      sendError(res, userErrors.PASSWORD_MISSMATCH);
      return;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.updateOne({ password: hashedPassword });
    logger.info(userMessages.PASSWORD_UPDATE_SUCCESS.message + req.originalUrl);
    res.status(200).json({
      data: { status: 200, message: "Password Updated Successfully" },
    });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json({ error });
  }
}
