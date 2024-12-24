// can be reused by many routes
const { validationResult } = require('express-validator');
const validate = validations => {
  return async (req, res, next) => {
    // sequential processing, stops running validations chain if one fails.
    const errors = {}
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {

        result.array().forEach(error => {
            if (errors[error.path] === undefined) {
                errors[error.path] = []
            }
            errors[error.path].push(error.msg)
        })
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    next(req, res);
  };
};

exports.validate = validate;