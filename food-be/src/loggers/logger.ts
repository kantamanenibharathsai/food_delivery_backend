import { Logger, createLogger, format, transports } from "winston";
const { combine, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});

let logger: Logger;

if (process.env.NODE_ENV === "production") {
    logger = createLogger({
        level: "info",
        format: combine(timestamp(), myFormat),
        transports: [
            new transports.Console(),
            new transports.File({ filename: "./src/loggers/production.log" }),
        ],
    });
} else {
    logger = createLogger({
        level: "debug",
        format: combine(timestamp(), myFormat),
        transports: [new transports.Console()],
    });
}

export default logger;
