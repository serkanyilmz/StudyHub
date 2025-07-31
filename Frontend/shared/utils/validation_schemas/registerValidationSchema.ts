import * as Yup from 'yup';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/;

const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;

const registerValidationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .matches(usernameRegex, "Username can only contain letters, numbers, dots and underscores")
    .required("Username is required"),

  fullName: Yup.string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    //.matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces")
    .required("Full name is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .required("Password is required"),

  role: Yup.string()
    .oneOf(["STUDENT", "writWRITERer", "TEACHER"], "Invalid role selected")
    .required("Role is required"),
});

export default registerValidationSchema;