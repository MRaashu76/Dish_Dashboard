/**
 * Global error handling middleware.
 * Must be registered after all routes.
 */
const errorMiddleware = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV === "development";

  // Respect status codes set upstream; default to 500
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || "Internal Server Error";

  // Mongoose validation errors → 400
  if (err.name === "ValidationError") {
    statusCode = 400;
    const fieldMessages = Object.values(err.errors).map((e) => e.message);
    message = fieldMessages.join(", ");
  }

  // Mongoose duplicate key error → 409
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `Duplicate value for ${field}.`;
  }

  // Mongoose cast error (e.g. bad ObjectId) → 400
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for ${err.path}.`;
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDevelopment && { stack: err.stack }),
  });
};

export default errorMiddleware;
