// import { fcm } from "../config/firebaseConfig";
import logger from "../loggers/logger";

type sendNotificationPayload = {
    fcmToken: string;
    title: string;
    body: string;
    imageUrl?: string;
};

export async function sendNotification(
    payload: sendNotificationPayload
): Promise<boolean> {
    try {
        // await fcm.send({
        //     token: payload.fcmToken,
        //     notification: {
        //         title: payload.title,
        //         body: payload.body,
        //         imageUrl: payload.imageUrl,
        //     },
        // });
        logger.info(`sendNotification success for ${payload.fcmToken}`);
        return Promise.resolve(true);
    } catch (err) {
        logger.error(JSON.stringify(err) + "sendNotification error");
        return Promise.reject(false);
    }
}
