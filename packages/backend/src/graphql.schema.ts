
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CharacterInput {
    name?: string;
    quenta?: Upload;
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
    name?: string;
    quenta?: string;
}

export abstract class IMutation {
    abstract createUserWithCharacter(user: UserInput, character: CharacterInput): boolean | Promise<boolean>;

    abstract login(email: string, password: string, rememberMe?: boolean): boolean | Promise<boolean>;

    abstract logout(): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract none(): boolean | Promise<boolean>;

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
}

export type Date = any;
export type Upload = any;
