const { config } = require("dotenv");

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

const {
  API_VERSION,
  NODE_ENV,
  PORT,
  ORIGIN,
  DB_CNN,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  SECRET_JWT_ENV,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PERSISTENCE,
  EMAIL,
  PSW_EMAIL
} = process.env;

module.exports = {
  API_VERSION,
  NODE_ENV,
  PORT,
  ORIGIN,
  DB_CNN,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  SECRET_JWT_ENV,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  PERSISTENCE,
  EMAIL,
  PSW_EMAIL
};