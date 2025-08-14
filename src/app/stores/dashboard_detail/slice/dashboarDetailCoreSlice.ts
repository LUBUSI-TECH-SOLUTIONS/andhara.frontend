export interface DashboardDetailCoreSlice {
  isLoading: boolean;
  error: string | null;

  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}