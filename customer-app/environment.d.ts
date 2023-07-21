declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
  }