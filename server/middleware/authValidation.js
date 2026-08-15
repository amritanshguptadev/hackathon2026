const Joi = require('joi');

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    studentId: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
    university: Joi.string().min(2).max(150).required(),
    studentDeclared: Joi.alternatives()
      .try(Joi.boolean().valid(true), Joi.string().valid('true', 'on', '1'))
      .required()
      .messages({
        'any.required': 'You must confirm you are a university student',
        'any.only': 'You must confirm you are a university student',
      }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
    });
  }

  if (!req.file) {
    return res.status(400).json({
      message: 'Student ID card photo is required',
      success: false,
    });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(100).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Bad request ', error, success: false });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation,
};
