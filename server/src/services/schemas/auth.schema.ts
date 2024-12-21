import Joi, { ObjectSchema } from "joi";

const signupSchema: ObjectSchema = Joi.object().keys({
  name: Joi.string().required().min(3).max(8).messages({
    "string.base": "First name must be of type string.",
    "string.min": "First name must be 3 charecters.",
    "string.max": "First name must be less then 8 charecters.",
    "string.empty": "First name is a required field.",
  }),
  password: Joi.string().required().min(6).max(50).messages({
    "string.base": "Password must be of type string.",
    "string.min": "Invalid password.",
    "string.max": "Invalid password.",
    "string.empty": "Password is a required field.",
  }),
  email: Joi.string().required().email().messages({
    "string.base": "Email must be of type string.",
    "string.email": "Email must be valid.",
    "string.empty": "Email is a required field.",
  }),
});

const signinSchema: ObjectSchema = Joi.object().keys({
  password: Joi.string().required().min(6).max(50).messages({
    "string.base": "Password must be of type string.",
    "string.min": "Invalid password.",
    "string.max": "Invalid password.",
    "string.empty": "Password is a required field.",
  }),
  email: Joi.string().required().email().messages({
    "string.base": "Email must be of type string.",
    "string.email": "Email must be valid.",
    "string.empty": "Email is a required field.",
  }),
});

const verifyEmailSchema: ObjectSchema = Joi.object().keys({
  code: Joi.string().required().messages({
    "string.base": "Code must be of type string.",
    "string.min": "Invalid Code.",
    "string.max": "Invalid Code.",
    "string.empty": "Code is a required field.",
  }),
  email: Joi.string().required().email().messages({
    "string.base": "Email must be of type string.",
    "string.email": "Email must be valid.",
    "string.empty": "Email is a required field.",
  }),
});

const forgotSchema: ObjectSchema = Joi.object().keys({
  email: Joi.string().required().email().messages({
    "string.base": "Email must be of type string.",
    "string.email": "Email must be valid.",
    "string.empty": "Email is a required field.",
  }),
});

const resetSchema: ObjectSchema = Joi.object().keys({
  code: Joi.string().required().messages({
    "string.base": "Code must be of type string.",
    "string.min": "Invalid Code.",
    "string.max": "Invalid Code.",
    "string.empty": "Code is a required field.",
  }),
  password: Joi.string().required().min(6).max(50).messages({
    "string.base": "Password must be of type string.",
    "string.min": "Invalid password.",
    "string.max": "Invalid password.",
    "string.empty": "Password is a required field.",
  }),
});

const mfaVerifySchema: ObjectSchema = Joi.object().keys({
  code: Joi.string().required().messages({
    "string.base": "Code must be of type string.",
    "string.min": "Invalid Code.",
    "string.max": "Invalid Code.",
    "string.empty": "Code is a required field.",
  }),
  secretKey: Joi.string().required().messages({
    "string.base": "SecretKey must be of type string.",
    "string.min": "Invalid SecretKey.",
    "string.max": "Invalid SecretKey.",
    "string.empty": "SecretKey is a required field.",
  }),
});

export {
  signupSchema,
  signinSchema,
  verifyEmailSchema,
  forgotSchema,
  resetSchema,
  mfaVerifySchema,
};
