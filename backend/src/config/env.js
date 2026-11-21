import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/notes_app_10pearls",
  LOG_LEVEL:
    process.env.LOG_LEVEL ||
    (process.env.NODE_ENV === "production" ? "info" : "debug"),
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  JWT:{
    ACCESS_TOKEN:process.env.JWT_ACCESS_TOKEN,
    REFRESH_TOKEN:process.env.JWT_REFRESH_TOKEN,
    ACCESS_TOKEN_EXPIRES_IN:process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN:process.env.JWT_REFRESH_TOKEN_EXPIRES_IN
  }
};
const requiredJwtKeys = ["ACCESS_TOKEN", "REFRESH_TOKEN", "ACCESS_TOKEN_EXPIRES_IN", "REFRESH_TOKEN_EXPIRES_IN"];
for (const key of requiredJwtKeys) {
  if (!config.JWT[key]) {
    throw new Error(`Missing required JWT configuration: JWT_${key}. Check your .env file.`);
  }
}
