import Joi from 'joi';

export const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'Full Name is required',
      'any.required': 'Full Name is required',
    }),
    studentId: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Student ID is required',
      'any.required': 'Student ID is required',
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).max(100).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string().allow('', null).optional(),
    college: Joi.string().min(2).max(150).allow('', null).optional(),
    university: Joi.string().min(2).max(150).allow('', null).optional(),
    studentDeclared: Joi.alternatives()
      .try(Joi.boolean(), Joi.string())
      .optional(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
    });
  }

  // Ensure at least college or university is supplied
  if (!req.body.college && !req.body.university) {
    return res.status(400).json({
      message: 'College / University is required',
      success: false,
    });
  }

  next();
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Please enter a valid email address',
      'string.empty': 'Email is required',
      'any.required': 'Email is required',
    }),
    password: Joi.string().min(1).max(100).required().messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required',
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
    });
  }
  next();
};

export default {
  signupValidation,
  loginValidation,
};
