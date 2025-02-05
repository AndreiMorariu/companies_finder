import { Request, Response, NextFunction } from "express";

import { jsendSuccess } from "../utils/jsendResponse";

import {
  getCompanyByCui,
  getCompaniesByFilters,
  getCompaniesStatistics
} from "../services/companies.service";

import { CompanyFilters } from "../types/companies";

export function getCompanyByCuiHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { cui } = req.params;
    const company = getCompanyByCui(cui);
    res.send(jsendSuccess({ company }));
  } catch (error) {
    next(error);
  }
}

export function getCompaniesStatisticsHandler(
  req: Request<any, any, any, CompanyFilters>,
  res: Response,
  next: NextFunction
) {
  try {
    const statistics = getCompaniesStatistics(req.query);
    res.send(jsendSuccess({ statistics }));
  } catch (error) {
    next(error);
  }
}

export function getCompaniesByFiltersHandler(
  req: Request<any, any, any, CompanyFilters>,
  res: Response,
  next: NextFunction
) {
  try {
    const { limit = "10", offset = "0" } = req.query;
    const pageNumber = Math.floor(Number(offset) / Number(limit)) + 1;

    const { companies, totalCompanies } = getCompaniesByFilters(req.query);

    res.send(
      jsendSuccess(
        { companies },
        {
          currentPage: pageNumber,
          itemsPerPage: Number(limit),
          totalItems: totalCompanies,
          totalPages: Math.ceil(totalCompanies / Number(limit))
        }
      )
    );
  } catch (error) {
    next(error);
  }
}
