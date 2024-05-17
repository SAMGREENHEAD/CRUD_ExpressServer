export const createuserValidationScheme = {
  username: {
    isLength: {
      options: { min: 5, max: 5 },
      errorMessage: "lenght must be 3 to 32 characters",
    },
    notEmpty: { errorMessage: "username cannot be empty" },
    isString: { errorMessage: "username must be a string" },
  },
  surname: {
    notEmpty: { errorMessage: "surname cannot be empty" },
  },
  email: { notEmpty: { errorMessage: "email cannot be empty" } },
  password: { notEmpty: { errorMessage: "password cannot be empty" } },
};
