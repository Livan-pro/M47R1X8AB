import { parse, DotenvParseOutput } from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";

const projectRoot = resolve(__dirname, "..");
let conf: DotenvParseOutput = null;
try {
  conf = parse(readFileSync(".env"));
} catch (err) {
  throw new Error("Error reading config file: " + err.message);
}

export abstract class Config {
  private static readonly conf: DotenvParseOutput = conf;

  public static get(key: string, defaultValue?: string): string {
    if (Object.hasOwnProperty.call(Config.conf, key)) {
      return Config.conf[key];
    } else {
      if (defaultValue === undefined) throw new Error(`Config value not set: ${key}`);
      else return defaultValue;
    }
  }

  public static getBoolean(key: string, defaultValue?: boolean): boolean {
    if (Object.hasOwnProperty.call(Config.conf, key)) {
      return Config.conf[key] === "true" || Config.conf[key] === "1";
    } else {
      if (defaultValue === undefined) throw new Error(`Config value not set: ${key}`);
      else return defaultValue;
    }
  }

  public static getInt(key: string, defaultValue?: number): number {
    if (Object.hasOwnProperty.call(Config.conf, key)) {
      const num = parseInt(Config.conf[key], 10);
      if (isNaN(num)) throw new Error(`Config value is NaN: ${key}`);
      return num;
    } else {
      if (defaultValue === undefined) throw new Error(`Config value not set: ${key}`);
      else return defaultValue;
    }
  }

  public static getFloat(key: string, defaultValue?: number): number {
    if (Object.hasOwnProperty.call(Config.conf, key)) {
      const num = parseFloat(Config.conf[key]);
      if (isNaN(num)) throw new Error(`Config value is NaN: ${key}`);
      return num;
    } else {
      if (defaultValue === undefined) throw new Error(`Config value not set: ${key}`);
      else return defaultValue;
    }
  }

  public static getRoot(): string {
    return projectRoot;
  }
}
