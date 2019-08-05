import { ExceptionFilter, Catch, ArgumentsHost, Logger, HttpException } from "@nestjs/common";
import { CustomError } from "CustomError";
import { ntob } from "number-to-base64";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private log = new Logger(AllExceptionsFilter.name);

  catch(exception: Error, host: ArgumentsHost) {
    if (exception instanceof CustomError || exception instanceof HttpException) throw exception;
    else {
      const code = ntob(Date.now());
      this.log.error(`ERR${code} ${exception.stack}`);
      throw new Error(`Возникла ошибка. Код ошибки: ${code}. Обратитесь к мастерам!`);
    }
  }
}
