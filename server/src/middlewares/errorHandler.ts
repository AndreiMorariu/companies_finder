import { Request, Response, NextFunction } from "express";

import { HttpError } from "../utils/HttpErrors";
import { NotFoundError } from "../utils/HttpErrors";
import { BadRequestError } from "../utils/HttpErrors";

import { jsendError } from "../utils/jsendResponse";

export const errorHandler = (
  err: Error | HttpError | NotFoundError | BadRequestError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof NotFoundError) {
    res.status(404).json({ status: "fail", data: { error: err.message } });
  } else if (err instanceof BadRequestError) {
    res.status(400).json({ status: "fail", data: { error: err.message } });
  } else if (err instanceof HttpError) {
    res.status(err.status).json({ status: "error", message: err.message });
  } else {
    res.status(500).json(jsendError("Internal Server Error"));
  }
};
