import express, { Request, response, Response } from "express";
import cors, { CorsOptions } from "cors";
import morgan from "morgan";

import {
  getCompanyByCuiHandler,
  getCompaniesByFiltersHandler,
  getCompaniesStatisticsHandler
} from "./controllers/companies.controllers";

import { errorHandler } from "./middlewares/errorHandler";
import { setInterval } from "node:timers/promises";

const corsOptions: CorsOptions = {
  origin: "http://localhost:5173",
  methods: "GET"
};

const app = express();

app.use(cors(corsOptions));
app.use(
  morgan(
    ":remote-addr :remote-user :status :method :url - :response-time ms :date[web]"
  )
);

const PORT = 8080;
const BASE_URL = "/api";

app.get(`${BASE_URL}/companies/:cui`, getCompanyByCuiHandler);
app.get(`${BASE_URL}/companies`, getCompaniesByFiltersHandler);
app.get(`${BASE_URL}/statistics`, getCompaniesStatisticsHandler);
app.get("/favicon.ico", (_req: Request, res: Response) => {
  res.status(204);
});

app.use(errorHandler);

app.listen(PORT);
