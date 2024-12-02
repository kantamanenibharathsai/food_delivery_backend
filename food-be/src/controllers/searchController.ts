import { Request, Response } from "express";
import userModel from "../models/userModel";
import searchModel from "../models/searchModel";
import logger from "../loggers/logger";
import { sendError } from "../middlewares/errorHanlder";
import { searchErrors } from "../utils/Errors/commonErrors";
import { searchMessages } from "../utils/successMessages/successMessages";
import { isAlphaNum, isNumber } from "../utils/validationutils";

export async function createSearch(req: Request, res: Response) {
  /*
    #swagger.tags=['search']
    #swagger.summary='Create Search'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    },
    #swagger.parameters['search'] = {
      in: 'query',
      required: true,
      type: 'string'
    }
    */
  try {
    const { search } = req.query;
    const userId = req.user._id;
    const searchDoc = await searchModel.create({ userId, search });
    logger.info(
      searchMessages.SEARCH_CREATED_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { searchDoc } });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json({ error });
  }
}

export async function getRecentSearches(req: Request, res: Response) {
  /*
    #swagger.tags=['search']
    #swagger.summary='Get Recent Searches'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    #swagger.parameters['limit'] = {
      in: 'query',
      required: true,
      type: 'number'
    }
    */
  try {
    const userId = req.user._id;
    let { limit = 10 } = req.query;

    if (!isNumber(limit) && !isAlphaNum(limit)) {
      sendError(res, { error: "limit is not a number", status: 400 })
      return;
    }

    const searches = await searchModel
      .find({ userId })
      .sort({ createdAt: "desc" })
      .limit(Number(limit));
    logger.info(
      searchMessages.SEARCH_FOUND_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { recentSearches: searches } });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json({ error });
  }
}

//Get Popular Searches
export async function findPopularSearches(req: Request, res: Response) {
  /*
    #swagger.tags=['search']
    #swagger.summary='Get Popular Searches'
    #swagger.parameters['authorization'] = {
      in: 'header',
      required: true,
      type: 'string'
    }
    */
  try {
    const popularSearches = await searchModel.aggregate([
      { $group: { _id: "$search", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    logger.info(
      searchMessages.SEARCH_FOUND_SUCCESSFULLY.message + req.originalUrl
    );
    res.status(200).json({ data: { popularSearches } });
  } catch (error) {
    logger.error(error + req.originalUrl);
    res.status(500).json({ error });
  }
}
