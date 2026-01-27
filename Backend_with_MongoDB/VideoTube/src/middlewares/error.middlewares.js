import mongoose from "mongoose";

import { ApiError } from "../utils/api-error.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(err instanceof ApiError)) {
    const statusCode =
      error.statusCode || error instanceof mongoose.Error ? 400 : 500;

    const message = error.message || "Something went wrong";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  const response = {
    ...error,
    message: error.message,
    ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {}),
  };

  return res.status(error.statusCode).json(response);
};

export { errorHandler };

// errorHandler: centralized middleware that:
// Receives every error thrown in routes.
// If the error is already an ApiError, it uses it as-is.
// If not, it converts/wraps it into an ApiError (e.g., treat mongoose validation errors as 400).
// Sends a consistent JSON response (and includes stack only in development).
