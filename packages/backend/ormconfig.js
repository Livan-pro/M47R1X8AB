
const tsConfig = require("./tsconfig.json");
const {join} = require("path");

const production = process.env.NODE_ENV === "production";
const ext = production ? ".js" : ".ts";
const baseUrl = join(__dirname, production ? tsConfig.compilerOptions.outDir : tsConfig.compilerOptions.baseUrl);

const {Config} = require(join(baseUrl, `config${ext}`));

module.exports = {
  type: "mysql",
  host: Config.get("DB_HOST"),
  port: Config.getInt("DB_PORT"),
  username: Config.get("DB_USER"),
  password: Config.get("DB_PASSWORD"),
  database: Config.get("DB_NAME"),
  synchronize: Config.getBoolean("DB_SYNC"),
  entities: [join(baseUrl, "**", `*.entity${ext}`)],
  logging: Config.getBoolean("DB_LOG")
}
