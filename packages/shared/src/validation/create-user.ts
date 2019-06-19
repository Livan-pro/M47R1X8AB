import {IsEmail, MinLength, MaxLength, IsNotEmpty, IsOptional, IsDate} from "class-validator";
import {IsEqualTo} from "../utils/IsEqualTo";

export class CreateUser {
  @IsEmail(undefined, {message: "Неверный email"})
  email: string | undefined = undefined;

  @MinLength(8, {message: "Пароль должен содержать не менее 8 символов"})
  @MaxLength(64, {message: "Пароль должен содержать не более 64 символов"})
  password: string | undefined = undefined;

  @IsOptional()
  @IsEqualTo("password", {message: "Пароль и подтверждение не совпадают"})
  passwordConfirmation: string | undefined = undefined;

  @MinLength(2, {message: "Имя должно быть длиннее 1 символа"})
  @MaxLength(255, {message: "Имя должно быть короче 256 символов"})
  firstName: string | undefined = undefined;

  @MinLength(2, {message: "Фамилия должна быть длиннее 1 символа"})
  @MaxLength(255, {message: "Фамилия должна быть короче 256 символов"})
  lastName: string | undefined = undefined;

  @MinLength(9, {message: "Телефон должен быть длиннее 8 символов"})
  @MaxLength(20, {message: "Телефон должен быть короче 21 символа"})
  phone: string | undefined = undefined;

  @IsNotEmpty({message: "Должна быть заполнена"})
  @MaxLength(47, {message: "Должна быть короче 48 символов"}) // 47 = "https://vk.com/" + 32
  vkId: string | undefined = undefined;

  @MaxLength(20, {message: "Максимальная длина - 1000 символов"})
  medicalInfo: string | undefined = undefined;
}
