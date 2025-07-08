import apiClient from "@/app/apiClient";
import { RegisterResponse, UserRequest } from "@/features/auth/types/userTypes";

export const UserService = {
  register: async (email: string, password: string, role: string) => {
    try {
      const response = await apiClient.post<RegisterResponse>("/auth/register",
        {
          email,
          password,
          role,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw new Error("Error registering user");
    }
  },
  getUsers: async () => {
    try {
      const response = await apiClient.get<UserRequest>(`/auth/users/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw new Error("Error fetching user");
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