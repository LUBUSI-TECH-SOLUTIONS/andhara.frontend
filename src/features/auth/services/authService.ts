import apiClient from "@/app/apiClient";
import { ApiResponse } from "@/app/apiClient";

export interface LoginResponse {
   token: string;
   user: {
      email: string;
      role: string;
   };
};

export const authService = {
   loginRequest: async (email: string, password: string): Promise<ApiResponse<LoginResponse>> => {
      return await apiClient.post<LoginResponse>("/v1/auth/login", {
         email,
         password
      });
   },

   logout: async () => {
      const response = await apiClient.post("/v1/auth/logout");
      localStorage.removeItem('authToken');
      return response.status;
   }
}

