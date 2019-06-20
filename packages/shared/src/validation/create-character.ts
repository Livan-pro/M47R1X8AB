import {MinLength, MaxLength, Min, Max} from "class-validator";

export class CreateCharacter {
  @MinLength(2, {message: "Имя должно быть длиннее 1 символа"})
  @MaxLength(255, {message: "Имя должно быть короче 256 символов"})
  name: string | undefined = undefined;

  quenta: any | undefined = undefined;
}
