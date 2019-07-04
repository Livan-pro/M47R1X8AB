
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class ChangePasswordInput {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
}

export class CharacterInput {
    name?: string;
    quenta?: Upload;
}

export class EditUserInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
    vkId?: string;
    medicalInfo?: string;
}

export class LoginInput {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export class UserInput {
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    vkId?: string;
    medicalInfo?: string;
}

export class Character {
    id: number;
    name: string;
    quenta?: string;
}

export class LoginResult {
    email: string;
    token: string;
}

export abstract class IMutation {
    abstract editCharacter(id: number, character: CharacterInput): boolean | Promise<boolean>;

    abstract createUserWithCharacter(user: UserInput, character: CharacterInput): boolean | Promise<boolean>;

    abstract login(email: string, password: string, rememberMe?: boolean): LoginResult | Promise<LoginResult>;

    abstract logout(): boolean | Promise<boolean>;

    abstract editUser(user: EditUserInput): boolean | Promise<boolean>;

    abstract changePassword(data: ChangePasswordInput): boolean | Promise<boolean>;
}

export class News {
    title: string;
    text: string;
    datetime: Date;
}

export abstract class IQuery {
    abstract none(): boolean | Promise<boolean>;

    abstract characters(): Character[] | Promise<Character[]>;

    abstract news(): News[] | Promise<News[]>;

    abstract me(): User | Promise<User>;
}

export class User {
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    vkId?: string;
    medicalInfo?: string;
    characters?: Character[];
    mainCharacter?: Character;
}

export type Date = any;
export type Upload = any;
