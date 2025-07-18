import apiClient from "@/app/apiClient";
import { AxiosError, AxiosResponse } from "axios";

export interface LoginResponse{
   token: string;
   user: {
      email: string;
      role: string;
   };
};

export const authService = {
   loginRequest: async (email: string, password: string): Promise<AxiosResponse<LoginResponse>> => {
      try {
         const response: AxiosResponse<LoginResponse> = await apiClient.post<LoginResponse>("/auth/login", {
            email,
            password
         });
         localStorage.setItem("authToken", response.data.token);
         return response;
      } catch (error) {
         const axiosError = error as AxiosError<{ detail?: string }>;
         const errorMessage =
           axiosError.response?.data?.detail || "Error al iniciar sesión";
         throw new Error(errorMessage);
      }
   },

   logout: async () => {
      try {
         const response = await apiClient.post("/auth/logout")
         localStorage.removeItem('authToken');
         return response.status
      } catch (error) {
         console.error("Logout failed:", error);
      }
   }
}

