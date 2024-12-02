import { Request } from "express";
import { IUser } from "../../models/userModel";

interface User extends IUser { }

declare global {
    namespace Express {
        export interface Request {
            user: User;
        }
    }
}
