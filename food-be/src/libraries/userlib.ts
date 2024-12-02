import jwt from "jsonwebtoken";
import mongoose from "mongoose";
type generateJwtTokenParams = {
    id: mongoose.Schema.Types.ObjectId;
};
export function generateJwtToken(payload: generateJwtTokenParams) {
    const SECRETKEY = process.env.JWTSECRETKEY
        ? process.env.JWTSECRETKEY
        : "secret";
    console.log(payload);
    const token = jwt.sign(payload, SECRETKEY, { expiresIn: "7d" });
    return token;
}
