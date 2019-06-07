
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class CharacterInput {
    name?: string;
    quenta?: Upload;
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

export abstract class IMutation {
    abstract createUserWithCharacter(user: UserInput, character: CharacterInput): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract none(): boolean | Promise<boolean>;
}

export type Date = any;
export type Upload = any;
