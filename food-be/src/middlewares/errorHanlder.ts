import { Response } from "express";

interface customError {
    error: string;
    status?: number;
}

export type errors = customError[];

export type sendErrorResponse =
    | { status: number; errors: errors }
    | { status: number; error: customError };

export function sendError(
    res: Response,
    error?: customError | errors,
    status?: number
) {
    if (!status) status = 500;
    if (!error) {
        error = {
            status: 500,
            error: "Internal Server Error",
        };
    }

    if (Array.isArray(error)) {
        return res.status(status).json({
            status: status,
            errors: error,
        });
    } else {
        return res.status(error.status || status).json({
            status: error.status,
            error: error,
        });
    }
}
