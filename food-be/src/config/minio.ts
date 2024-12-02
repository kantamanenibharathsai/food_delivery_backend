import { Client } from "minio";

const endPoint = process.env.MINIO_ENDPOINT || "localhost";
const port = Number(process.env.MINIO_PORT) || 9000;
const minio_access_key = process.env.MINIO_ACCESS_KEY as string;
const minio_secret_key = process.env.MINIO_SECRET_KEY as string;

const minioClient = new Client({
    endPoint: endPoint,
    port: port,
    useSSL: false,
    accessKey: minio_access_key,
    secretKey: minio_secret_key,
});

export default minioClient;
