import axios, {
   AxiosInstance,
   AxiosResponse,
   AxiosError,
   AxiosHeaders,
   InternalAxiosRequestConfig
} from "axios";

export type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface ApiRequestConfig extends InternalAxiosRequestConfig  {
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

export interface ApiError<T = any> {
   message: string;
   status?: number;
   code?: string;
   data?: T;
   isCancelled?: boolean;
   originalError?: AxiosError | Error;
}

class ApiClient {
   private static instance: ApiClient;
   private axiosInstance: AxiosInstance;
   private pendingRequests: Map<string, AbortController>;

   private constructor(baseURL: string) {
      this.axiosInstance = axios.create({
         baseURL,
         timeout: 90000,
         headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
         },
      });

      this.pendingRequests = new Map();
      this.setupInterceptors();
   }

   public static getInstance(baseURL?: string): ApiClient {
      if (!ApiClient.instance) {
         if (!baseURL)
            throw new Error(
               "Base URL is required for the first instance of ApiClient."
            );
         ApiClient.instance = new ApiClient(baseURL);
      }
      return ApiClient.instance;
   }

   private setupInterceptors(): void {
      this.axiosInstance.interceptors.request.use(
         (config) => {
            const updatedConfig = config as ApiRequestConfig;

            if(!updatedConfig.isPublic){
               const token = localStorage.getItem("authToken");
               if (token) {
                  updatedConfig.headers.set("Authorization", `Bearer ${token}`);
               }
            }

            // Abortcontroller
            const requestId = this.generateRequestId(updatedConfig);
            if (this.pendingRequests.has(requestId)) {
               this.cancelRequest(requestId);
            }

            const abortController = new AbortController();
            updatedConfig.signal = abortController.signal;
            updatedConfig.abortController = abortController;
            this.pendingRequests.set(requestId, abortController);

            return updatedConfig;
         },
         (error) => Promise.reject(this.normalizeError(error))
      );

      this.axiosInstance.interceptors.response.use(
         (response) => {
            this.pendingRequests.delete(
               this.generateRequestId(response.config as ApiRequestConfig)
            );
            return this.normalizeResponse(response);
         },
         (error: AxiosError) => {
            if (error.config) {
               this.pendingRequests.delete(
                  this.generateRequestId(error.config as ApiRequestConfig)
               );
            }
            return Promise.reject(this.normalizeError(error));
         }
      );
   }
   // Helper Methods
   private generateRequestId(config: ApiRequestConfig): string {
      return `${config.method?.toUpperCase()}_${config.url}_${JSON.stringify(config.params || {})}_${JSON.stringify(config.data || {})}`;
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
      if(axios.isCancel(error)){
        return {
            message: "Request cancelled",
            isCancelled: true,
            originalError: error as Error,
        }
      }
      if(axios.isAxiosError(error)){
        return {
            message: error.message,
            status: error.response?.status,
            code: error.code,
            data: error.response?.data,
            originalError: error as AxiosError,
        }
      }
  
      return {
            message: error.message || "An unknown error occurred",
            originalError: error as Error,
        };
     }

   //HTTP Methods

   public async request<T = any>(
      config: ApiRequestConfig
   ): Promise<ApiResponse<T>> {
      try {
         const response = await this.axiosInstance.request<T>(config);
         return this.normalizeResponse(response);
      } catch (error) {
         throw this.normalizeError(error);
      }
   }

   public async get<T = any>(
      url: string,
      config?: ApiRequestConfig
   ): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "get", headers: config?.headers || new AxiosHeaders() });
   }

   public async post<T = any>(
      url: string,
      data?: any,
      config?: ApiRequestConfig
   ): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "post", data, headers: config?.headers || new AxiosHeaders() });
   }

   public async put<T = any>(
      url: string,
      data?: any,
      config?: ApiRequestConfig
   ): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "put", data, headers: config?.headers || new AxiosHeaders() });
   }

   public async patch<T = any>(
      url: string,
      data?: any,
      config?: ApiRequestConfig
   ): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "patch", data, headers: config?.headers || new AxiosHeaders() });
   }

   public async delete<T = any>(
      url: string,
      config?: ApiRequestConfig
   ): Promise<ApiResponse<T>> {
      return this.request({ ...config, url, method: "delete", headers: config?.headers || new AxiosHeaders() });
   }

   // Request Management
   public cancelAllRequests(): void {
      this.pendingRequests.forEach((controller, requestId) => {
         controller.abort();
         this.pendingRequests.delete(requestId);
      });
   }

   public cancelRequest(requestId: string): void {
      const controller = this.pendingRequests.get(requestId);
      if (controller) {
         controller.abort();
         this.pendingRequests.delete(requestId);
      }
   }   

   //Config Methods

   protected setBaseURL(baseURL: string): void {
    this.axiosInstance.defaults.baseURL = baseURL;
   }

   public setHeader(key: string, value: string): void {
      this.axiosInstance.defaults.headers.common[key] = value;
   }

    public removeHeader(key: string): void {
        delete this.axiosInstance.defaults.headers.common[key];
    }
}

export default ApiClient.getInstance(import.meta.env.VITE_API_URL_PROD);
