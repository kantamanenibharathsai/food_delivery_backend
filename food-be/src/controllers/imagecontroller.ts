import { Request, Response } from "express";
import logger from "../loggers/logger";
import ImageModel from "../models/imageModel";
import minioClient from "../config/minio";
import { getObject } from "../libraries/minioLib";
import streams from "stream";
// import fileModel from "../models/imageModel";
import { sendError } from "../middlewares/errorHanlder";
export async function getImageByid(req: Request, res: Response) {
  /*
    #swagger.tags=['image']
    #swagger.parameters['authorization']={
        in:'header', 
        required:true,
        type:'string'
    }
    #swagger.parameters['id']={
        in:'path',
        required:true,
        type:'string'
    }
    */
  try {
    const { id } = req.params;
    const imageDoc = await ImageModel.findOne({ _id: id });
    if (!imageDoc) {
      sendError(res, { error: "image not found", status: 404 });
      return;
    }
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", `inline`);
    const imgDestName = imageDoc.destination_name.split("/")[1];
    const imagebuffer = await getObject(imgDestName, res);

    res.end(imagebuffer);
    return;
  } catch (err) {
    logger.error(JSON.stringify(err), `  ${req.originalUrl}`);
    res.status(500).json(err);
  }
}

export async function getFileByName(req: Request, res: Response) {}
