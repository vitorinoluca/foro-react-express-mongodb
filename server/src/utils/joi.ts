import Joi from 'joi';

export const validateUsername = (username: string): string | null => {
  const schema = Joi.string()
    .min(5)
    .regex(
      /^[a-zA-Z0-9_]*$/,
      'Solo se permiten letras, números y guiones bajos (_)',
    )
    .required()
    .messages({
      'string.base': 'El nombre de usuario debe ser una cadena de texto',
      'string.empty': 'El nombre de usuario no puede estar vacío',
      'string.min':
        'El nombre de usuario debe tener al menos {#limit} caracteres',
      'any.required': 'El nombre de usuario es un campo requerido',
      'string.pattern.base':
        'El nombre de usuario solo puede contener letras, números y guiones bajos (_)',
    });

  const result = schema.validate(username);
  return result.error != null ? result.error.details[0].message : null;
};

export const validatePassword = (password: string): string | null => {
  const schema = Joi.string()
    .min(8)
    .pattern(/^[a-zA-Z0-9!@#$%^&*()_+{}[\]:;<>,.?~\\-]+$/)
    .required()
    .messages({
      'string.base': 'La contraseña debe ser una cadena de texto',
      'string.empty': 'La contraseña no puede estar vacía',
      'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
      'any.required': 'La contraseña es un campo requerido',
      'string.pattern.base':
        'La contraseña solo puede contener letras, números y algunos caracteres especiales',
    });

  const result = schema.validate(password);
  return result.error != null ? result.error.details[0].message : null;
};

export const validateEmail = (email: string): string | null => {
  const schema = Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .messages({
      'string.base': 'El email debe ser una cadena de texto',
      'string.empty': 'El email no puede estar vacío',
      'any.required': 'El email es un campo requerido',
      'string.email': 'Por favor, introduce un email válido',
    });

  const result = schema.validate(email);

  if (result.error != null) {
    return result.error.details[0].message;
  }

  return null;
};
