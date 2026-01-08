const { validationResult } = require("express-validator");

const validate = (validations) => async (req, res, next) => {
  for (const validation of validations) {
    // Run validations sequentially to collect all errors
    // eslint-disable-next-line no-await-in-loop
    await validation.run(req);
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors
        .array()
        .map((err) => ({ field: err.path, message: err.msg })),
    });
  }

  return next();
};

module.exports = validate;
