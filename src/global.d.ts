declare module '*.css';
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL_PROD: string;
  // puedes agregar más si las tienes
  // readonly VITE_OTRA_VARIABLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}