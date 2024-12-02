import minioClient from "../config/minio";
// import { PutObjectCommand } from "@aws-sdk/client-s3";
import ImageModel, { IImage } from "../models/imageModel";
import logger from "../loggers/logger";
import { Response } from "express";
import { Document } from "mongoose";

function getFileName(filename: string): string {
  const splittedName = filename.split(".");
  return `${splittedName[0]}_${Date.now()}.${splittedName[1]}`;
}

export async function uploadFiles(
  files: Express.Multer.File[]
): Promise<string[]> {
  try {
    const bucket = process.env.BUCKET;
    if (!bucket) throw new Error("Bucket name not mentioned");

    const exists = await minioClient.bucketExists(bucket);
    if (!exists) {
      await minioClient.makeBucket(bucket, "us-east-1");
    }

    const pushObjPrms: Promise<any>[] = [];
    const imagePrms: Promise<Document<unknown, {}, IImage> & IImage>[] = [];
    for (const file of files) {
      const destinationObject = getFileName(file.originalname);
      pushObjPrms.push(
        minioClient.putObject(bucket, destinationObject, file.buffer, file.size)
      );
      imagePrms.push(
        ImageModel.create({
          imageName: file.originalname,
          destination_name: `${bucket}/${destinationObject}`,
          mimetype: file.mimetype,
        })
      );
    }

    await Promise.all(pushObjPrms);
    const images = await Promise.all(imagePrms);
    const imageIds = images.map((image) => image._id.toString());
    console.log(images);
    return imageIds;
  } catch (err) {
    console.error(err);
    throw new Error("Failed to upload files");
  }
}
export async function getObject(object_name: string, res: Response) {
  try {
    return new Promise(async (resolve, reject) => {
      const chunks: any[] = [];
      let length = 0;
      const bucket = process.env.BUCKET;
      if (!bucket) throw new Error("bucket name not mentioned");
      const object = await minioClient.getObject(bucket, object_name);
      object.on("error", (err: any) => {
        return reject(err);
      });
      object.on("data", (chuck: any) => {
        length += chuck.length;
        chunks.push(chuck);
      });
      object.on("end", () => {
        const buffer = Buffer.concat(chunks, length);
        return resolve(buffer);
      });
    });
  } catch (err) {
    logger.error(JSON.stringify(err));
    return Promise.reject(err);
  }
}
