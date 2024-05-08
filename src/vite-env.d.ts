/// <reference types="vite/client" />


interface ImportMetaEnv {
    // Common variables across environments
    readonly VITE_API_URL: string;
  
    // Backend-specific variables
    readonly MONGO_URI: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }