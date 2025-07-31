import * as Yup from "yup";


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const usernameRegex = /^[a-zA-Z0-9._]{3,30}$/;

const loginValidationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .matches(usernameRegex, "Username can only contain letters, numbers, dots and underscores")
    .required("Username is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    // .matches(
    //   passwordRegex,
    //   "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    // )
    .required("Password is required"),
});



export default loginValidationSchema;