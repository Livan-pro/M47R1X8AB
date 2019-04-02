declare module "graphql-upload" {
  import { ReadStream } from "fs";
  import { Request, Response, NextFunction } from "express";
  type FileUpload = Promise<{
    filename: string;
    mimetype: string;
    encoding: string;
    createReadStream: () => ReadStream;
  }>;

  type UploadOptions = {
    maxFieldSize?: number = 1000000;
    maxFileSize?: number = Infinity;
    maxFiles?: nnumber = Infinity;
  };
}