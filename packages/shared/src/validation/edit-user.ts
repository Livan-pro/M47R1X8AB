import {MinLength, MaxLength, IsNotEmpty} from "class-validator";

export class EditUser {
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

  @MaxLength(1000, {message: "Максимальная длина - 1000 символов"})
  medicalInfo: string | undefined = undefined;
}
