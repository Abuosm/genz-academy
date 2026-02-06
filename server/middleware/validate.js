const logger = require('../utils/logger');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (err) {
    logger.warn(`Validation failed: ${JSON.stringify(err.errors)} - ${req.originalUrl}`);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: err.errors
    });
  }
};

module.exports = validate;
