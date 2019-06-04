const dotenv = require("dotenv");
const tscPaths = require("tsconfig-paths");
const tsConfig = require("./tsconfig.json");
const path = require("path");
dotenv.config({path: path.join(__dirname, ".env")});

const baseUrl = path.resolve(__dirname, tsConfig.compilerOptions.outDir)
tscPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});

function toBoolean(str) {
  return str === "true" || str === "1";
}

module.exports = {
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: toBoolean(process.env.DB_SYNC),
  entities: [`${baseUrl}/entities/*.js`],
  logging: toBoolean(process.env.DB_LOG),
  migrations: [`${baseUrl}/migrations/*.js`],
  cli: {
    migrationsDir: "src/migrations"
  }
}