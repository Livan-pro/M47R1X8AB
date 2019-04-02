import {MinLength, MaxLength, Min, Max} from "class-validator";

export class CreateCharacter {
  @MinLength(2, {message: "Имя должно быть длиннее 1 символа"})
  @MaxLength(255, {message: "Имя должно быть короче 256 символов"})
  name: string = "";

  @Min(1, {message: "Минимальный возраст - 1 год"})
  @Max(1000, {message: "Максимальный возраст - 1000 лет"})
  age: number = 0;

  quenta: File = null;
}