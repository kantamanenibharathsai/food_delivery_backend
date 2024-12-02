import { NextFunction, Request, Response } from "express";
import {
    isString,
    isNumber,
    isValidObjectId,
    isBoolean,
} from "../utils/validationutils";
import { errors, sendError } from "../middlewares/errorHanlder";

export async function createCategoryValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { name, description } = req.body;
    const Error: errors = [];

    if (!name) Error.push({ error: "Name field is empty" });
    if (name && !isString(name)) Error.push({ error: "Name must be a string" });
    if (!description) Error.push({ error: "Description field is empty" });
    if (description && !isString(description)) Error.push({ error: "Description must be a string" });

    if (Error.length > 0) {
        sendError(res, Error, 400);
        return;
    }
    next();
}

export async function addSubCategoryValidator(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { categoryId, name, description = "" } = req.body;
    const Error: errors = [];

    if (!categoryId) Error.push({ error: "Category id field is empty" });
    if (categoryId && !isValidObjectId(categoryId)) {
        Error.push({ error: "category is not valid" });
    }
    if (!name) Error.push({ error: "Name field is empty" });
    if (name && !isString(name)) Error.push({ error: "Name must be a string" });
    if (description && !isString(description)) Error.push({ error: "Description must be a string" });

    if (Error.length > 0) {
        sendError(res, Error, 400);
        return;
    }
    next();
}
