import { UserService } from "@/features/auth/services/registerService";
import { UserRequest } from "@/features/auth/types/userTypes";
import { create } from "zustand";

interface RegisterState {
  isLoading: boolean;
  error: string | null;
  users: UserRequest[] | null;
  success: string | null;

  register: (email: string, password: string, role:string) => void;
  getUsers: () => void;
  deleteUser: (userId: string) => void;
}

export const useRegisterStore = create<RegisterState>((set, get) => ({
  isLoading: false,
  error: null,
  users: null,
  success: null,
  register: async (email: string, password: string, role:string) => {
    set({ isLoading: true, error: null });
    await UserService.register(email, password, role);
    try {
      set({
        isLoading: false,
        success: "User registered successfully",
        error: null,
      });
      await get().getUsers()
    } catch (error) {
      set({
        error: "Register failed. Please check your credentials and try again.",
        isLoading: false,
      });
    }
  },
  getUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const users = await UserService.getUsers();
      set({
        isLoading: false,
        users: Array.isArray(users) ? users : [users],
        error: null,
      });
      return users;
    } catch (error) {
      set({
        error: "Error fetching user",
        isLoading: false,
      });
    }
  },
  deleteUser: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      await UserService.deleteUser(userId);
      set((state) => ({
        users: state.users?.filter((user) => user.id !== userId) || null,
        isLoading: false,
        error: null,
        success: "User deleted successfully",
      }));
    } catch (error) {
      set({
        error: "Error deleting user",
        isLoading: false,
        success: null,
      });
    }
  },

}))