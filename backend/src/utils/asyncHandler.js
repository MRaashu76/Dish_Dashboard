/**
 * Wraps an async route handler and forwards any thrown errors to Express's
 * next() function, eliminating the need for repetitive try/catch blocks.
 *
 * @param {Function} fn - Async Express route handler
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
