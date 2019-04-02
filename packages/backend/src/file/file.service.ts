import { Injectable } from "@nestjs/common";
import { createWriteStream } from "fs";
import * as path from "path";
import { Config } from "config";
import * as mkdirp from "mkdirp";

@Injectable()
export class FileService {
  async upload(
    input: any,
    outputPath: string[] | string,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (typeof outputPath === "string") outputPath = [outputPath];
      outputPath = path.resolve(Config.getDataPath(), ...outputPath);
      await this.mkdirp(path.dirname(outputPath));
      const outputStream = createWriteStream(outputPath);
      const inputStream = input.createReadStream();
      inputStream.pipe(outputStream);
      inputStream.on("error", (err: Error) => {
        reject(err);
      });
      inputStream.on("close", () => {
        resolve();
      });
    });
  }

  async mkdirp(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      mkdirp(dir, (err: Error) => err ? reject(err) : resolve());
    });
  }
}
