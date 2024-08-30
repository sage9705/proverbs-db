const Joi = require("joi");

const validateProverb = (data) => {
  const schema = Joi.object({
    text: Joi.string().required().trim(),
    language: Joi.string().valid("en", "es", "fr").required(),
    source: Joi.string().allow("").optional(),
  });

  return schema.validate(data);
};

module.exports = {
  validateProverb,
};
