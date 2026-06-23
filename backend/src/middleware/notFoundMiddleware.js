/**
 * 404 Not Found middleware.
 * Catches requests to undefined routes and forwards a structured error.
 */
const notFoundMiddleware = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default notFoundMiddleware;
