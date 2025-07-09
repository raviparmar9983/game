
export interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    hash: string;
    confirmPassword: string;
    birthDate?: string;
    agreeTerms: boolean;
};