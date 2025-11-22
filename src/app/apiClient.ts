import axios, {
   AxiosInstance,
   AxiosResponse,
   AxiosError,
   AxiosHeaders,
   InternalAxiosRequestConfig,
   CreateAxiosDefaults,
   Cancel
} from "axios";

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface ApiRequestConfig extends InternalAxiosRequestConfig {
   abortController?: AbortController;
   isPublic?: boolean;
   headers: AxiosHeaders;
}

export interface ApiResponse<T = any> {
   data: T;
   status: number;
   statusText: string;
   headers: AxiosHeaders;
   config: ApiRequestConfig;
}

export interface ApiErrorData {
   message: string;
   code?: string;
   [key: string]: any;
}

export class ApiError extends Error {
   public status?: number;
   public code?: string;
   public data?: any;
   public isCancelled?: boolean;
   public originalError?: AxiosError | Error | Cancel;

   constructor(message: string, options?: {
      status?: number;
      code?: string;
      data?: any;
      isCancelled?: boolean;
      originalError?: AxiosError | Error | Cancel;
   }) {
      super(message);
      this.name = "ApiError";
      this.status = options?.status;
      this.code = options?.code;
      this.data = options?.data;
      this.isCancelled = options?.isCancelled;
      this.originalError = options?.originalError;
   }
}

class ApiClient {
   private static instance: ApiClient;
   private axiosInstance: AxiosInstance;
   private pendingRequests: Map<string, AbortController>;

   private constructor(baseURL: string) {
      const config: CreateAxiosDefaults = {
         baseURL,
         timeout: 30000, // Reduced timeout for better UX
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
         },
      };
      this.axiosInstance = axios.create(config);
      this.pendingRequests = new Map();
      this.setupInterceptors();
   }

   public static getInstance(baseURL?: string): ApiClient {
      if (!ApiClient.instance) {
         if (!baseURL) {
            // Fallback or throw, but better to handle gracefully if possible, or ensure env var is checked before call
            throw new Error("Base URL is required for the first instance of ApiClient.");
         }
         ApiClient.instance = new ApiClient(baseURL);
      }
      return ApiClient.instance;
   }

   private setupInterceptors(): void {
      this.axiosInstance.interceptors.request.use(
         (config) => {
            const updatedConfig = config as ApiRequestConfig;

            // Handle Authorization
            if (!updatedConfig.isPublic) {
               const token = localStorage.getItem("authToken");
               if (token) {
                  if (!updatedConfig.headers) {
                     updatedConfig.headers = new AxiosHeaders();
                  }
                  // Ensure headers is an AxiosHeaders instance or compatible object
                  if (updatedConfig.headers instanceof AxiosHeaders) {
                     updatedConfig.headers.set("Authorization", `Bearer ${token}`);
                  } else {
                     // Fallback for plain objects (though type definition says AxiosHeaders)
                     (updatedConfig.headers as any)["Authorization"] = `Bearer ${token}`;
                  }
               }
            }

            // Handle Cancellation
            const requestId = this.generateRequestId(updatedConfig);
            // Cancel previous request if it's a duplicate (optional strategy, depends on use case)
            // For now, we just track it. If we wanted to debounce/throttle, we'd do it here.
            // But strictly cancelling duplicates might be aggressive for some apps.
            // Let's just ensure we have a controller for manual cancellation.

            if (!updatedConfig.signal) {
               const abortController = new AbortController();
               updatedConfig.signal = abortController.signal;
               updatedConfig.abortController = abortController;
               this.pendingRequests.set(requestId, abortController);
            }

            return updatedConfig;
         },
         (error) => Promise.reject(this.normalizeError(error))
      );

      this.axiosInstance.interceptors.response.use(
         (response) => {
            const requestId = this.generateRequestId(response.config as ApiRequestConfig);
            this.pendingRequests.delete(requestId);
            return response; // Return raw axios response, we normalize in request method
         },
         (error: AxiosError) => {
            if (error.config) {
               const requestId = this.generateRequestId(error.config as ApiRequestConfig);
               this.pendingRequests.delete(requestId);
            }
            return Promise.reject(this.normalizeError(error));
         }
      );
   }

   private generateRequestId(config: ApiRequestConfig): string {
      return `${config.method?.toUpperCase()}_${config.url}_${JSON.stringify(config.params || {})}`;
   }

   private normalizeResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
      return {
         data: response.data,
         status: response.status,
         statusText: response.statusText,
         headers: response.headers as AxiosHeaders,
         config: response.config as ApiRequestConfig
      };
   }

   private normalizeError(error: any): ApiError {
      if (axios.isCancel(error)) {
         return new ApiError("Request cancelled", { isCancelled: true, originalError: error });
      }

      if (axios.isAxiosError(error)) {
         const data = error.response?.data as ApiErrorData;
         const message = data?.message || error.message || "An unknown error occurred";

         return new ApiError(message, {
            status: error.response?.status,
            code: error.code,
            data: data,
            originalError: error
         });
      }

      return new ApiError(error.message || "An unknown error occurred", { originalError: error });
   }

   public async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
      try {
         const response = await this.axiosInstance.request<T>(config);
         return this.normalizeResponse(response);
      } catch (error) {
         throw error; // Error is already normalized by interceptor
      }
   }

   public async get<T = any>(url: string, config?: Omit<ApiRequestConfig, 'headers'> & { headers?: any }): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "get", headers: new AxiosHeaders(config?.headers) });
   }

   public async post<T = any>(url: string, data?: any, config?: Omit<ApiRequestConfig, 'headers'> & { headers?: any }): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "post", data, headers: new AxiosHeaders(config?.headers) });
   }

   public async put<T = any>(url: string, data?: any, config?: Omit<ApiRequestConfig, 'headers'> & { headers?: any }): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "put", data, headers: new AxiosHeaders(config?.headers) });
   }

   public async patch<T = any>(url: string, data?: any, config?: Omit<ApiRequestConfig, 'headers'> & { headers?: any }): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "patch", data, headers: new AxiosHeaders(config?.headers) });
   }

   public async delete<T = any>(url: string, config?: Omit<ApiRequestConfig, 'headers'> & { headers?: any }): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "delete", headers: new AxiosHeaders(config?.headers) });
   }

   public cancelAllRequests(): void {
      this.pendingRequests.forEach((controller) => controller.abort());
      this.pendingRequests.clear();
   }

   public cancelRequest(requestId: string): void {
      const controller = this.pendingRequests.get(requestId);
      if (controller) {
         controller.abort();
         this.pendingRequests.delete(requestId);
      }
   }
}

export default ApiClient.getInstance(import.meta.env.VITE_API_URL_PROD);
