import nodemailer from "nodemailer";
///grlp zaio jaey mboo/;
const appEmail = process.env.APP_EMAIL;
const appPassword = process.env.APP_PASS;

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: appEmail,
    pass: appPassword,
  },
});

export default transporter;
