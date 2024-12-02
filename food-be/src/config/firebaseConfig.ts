import admin from "firebase-admin";
import logger from "../loggers/logger";

const file = require("./firebase_cred.json");

if (file == undefined || file == null) {
    logger.warn("firebase_cred.json not found, cloud messeging will not work.");
} else {
    admin.initializeApp({
        credential: admin.credential.cert(file),
    });
}

export const fcm = admin.messaging();
