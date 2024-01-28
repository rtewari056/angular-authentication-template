export type Login = {
    email: string;
    password: string;
}

export type ForgotPassword = {
    message: string;
}

export type UserInfo = {
    result: string;
    token: string;
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    role: string;
    active: number;
}
