// Wraps an async route handler so thrown errors are passed to next() automatically,
// instead of every controller needing its own try/catch block.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
