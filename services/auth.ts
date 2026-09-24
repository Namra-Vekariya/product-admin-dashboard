import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AuthUser> => {
  const response = await axiosInstance.post<AuthUser>("/auth/login", {
    username: credentials.username,
    password: credentials.password,
    expiresInMins: 60,
  });
  return response.data;
};

export const logoutUser = (): void => {
  Cookies.remove("token");
};