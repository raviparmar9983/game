import * as yup from "yup";

export const loginSchema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    hash: yup
        .string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
});

export const registerSchema = yup.object({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    hash: yup
        .string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("hash")], "Passwords must match")
        .required("Confirm your password"),
    birthDate: yup.string().optional(),
    agreeTerms: yup.boolean().oneOf([true], "You must accept the terms"),
});

export type RegisterFormInputs = yup.InferType<typeof registerSchema>;