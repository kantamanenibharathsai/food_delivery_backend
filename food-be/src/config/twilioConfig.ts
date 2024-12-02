import twilio from "twilio";

const accountSid = process.env.AccountSID || "AC";
const authToken = process.env.AuthToken || "";

const client = twilio(accountSid, authToken);

export default client;
