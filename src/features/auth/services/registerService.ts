import apiClient from "@/app/apiClient";
import { RegisterResponse, UserRequest } from "@/features/auth/types/userTypes";


export const UserService = {
  register: async (email: string, password: string, role: string) => {
    const response = await apiClient.post<RegisterResponse>("/v1/auth/create-user", {
      email,
      password,
      role,
    });
    return response.data;
  },
  getUsers: async () => {
    const response = await apiClient.get<UserRequest>(`/v1/auth/users/`);
    return response.data;
  },
  deleteUser: async (userId: string) => {
    const response = await apiClient.delete(`/auth/delete-user/${userId}`);
    return response.data;
  }
}