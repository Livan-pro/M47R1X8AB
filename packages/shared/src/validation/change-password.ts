import {MinLength, MaxLength, IsOptional} from "class-validator";
import {IsEqualTo} from "../utils/IsEqualTo";

export class ChangePassword {
  currentPassword: string | undefined = undefined;

  @MinLength(8, {message: "Пароль должен содержать не менее 8 символов"})
  @MaxLength(64, {message: "Пароль должен содержать не более 64 символов"})
  password: string | undefined = undefined;

  @IsOptional()
  @IsEqualTo("password", {message: "Пароль и подтверждение не совпадают"})
  passwordConfirmation: string | undefined = undefined;
}
