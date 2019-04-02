// tslint:disable-next-line:no-var-requires
const tsConfig = require("../tsconfig.json");
import { register } from "tsconfig-paths";

register({
  baseUrl: __dirname,
  paths: tsConfig.compilerOptions.paths,
});
