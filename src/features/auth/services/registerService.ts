import apiClient from "@/app/apiClient";
import { RegisterResponse, UserRequest } from "@/features/auth/types/userTypes";
import axios from "axios";
import { toast } from "sonner";

export const UserService = {
  register: async (email: string, password: string, role: string) => {
    try {
      const response = await apiClient.post<RegisterResponse>("/v1/auth/create-user",
        {
          email,
          password,
          role,
        },
      );
      if (response.status === 201) {
        toast.success("User registered successfully");
      }
      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Error al crear un nuevo usuario"
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  },
  getUsers: async () => {
    try {
      const response = await apiClient.get<UserRequest>(`/v1/auth/users/`);
      return response.data;
    } catch (error: unknown) {
      let errorMessage = "Error al crear un nuevo usuario"
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
      throw new Error(errorMessage);

    }
  },
  deleteUser: async (userId: string) => {
    try {
      const response = await apiClient.delete(`/auth/delete-user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Error deleting user");
    }
  }
}