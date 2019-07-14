import { Injectable } from "@nestjs/common";
import { createWriteStream, ReadStream, writeFile as writeFileCb } from "fs";
import * as path from "path";
import { Config } from "config";
import * as mkdirp from "mkdirp";
import { promisify } from "util";
const writeFile = promisify(writeFileCb);

@Injectable()
export class FileService {
  async upload(
    input: { createReadStream: () => ReadStream },
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

  async uploadFromBuffer(
    input: Buffer,
    outputPath: string[] | string,
  ): Promise<void> {
    if (typeof outputPath === "string") outputPath = [outputPath];
    outputPath = path.resolve(Config.getDataPath(), ...outputPath);
    await this.mkdirp(path.dirname(outputPath));
    await writeFile(outputPath, input);
  }

  async mkdirp(dir: string): Promise<void> {
    return new Promise((resolve, reject) => {
      mkdirp(dir, (err: Error) => err ? reject(err) : resolve());
    });
  }
}
