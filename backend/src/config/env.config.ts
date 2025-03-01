const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable for ${key}`);
  }

  return value;
};

export const PORT = getEnv("PORT", "8080");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");
export const MONGO_URI = getEnv("MONGO_URI");
export const BASE_URL = getEnv("BASE_URL");
export const JWT_ACCESS_SECRET = getEnv("JWT_ACCESS_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const GEMINI_API_KEY = getEnv("GEMINI_API_KEY");
export const BUCKET_NAME = getEnv("BUCKET_NAME");
export const BUCKET_REGION = getEnv("BUCKET_REGION");
export const AWS_ACCESS_KEY = getEnv("AWS_ACCESS_KEY");
export const AWS_SECRET_ACCESS_KEY = getEnv("AWS_SECRET_ACCESS_KEY");
