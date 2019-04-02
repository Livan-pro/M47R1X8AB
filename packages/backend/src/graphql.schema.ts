/* tslint:disable */
export abstract class CharacterInput {
    name?: string;
    age?: number;
    quenta?: Upload;
}

export abstract class UserInput {
    email?: string;
    password?: string;
    passwordConfirmation?: string;
    firstName?: string;
    lastName?: string;
    birthday?: Date;
    phone?: string;
    vkId?: string;
    medicalInfo?: string;
}

export abstract class IMutation {
    abstract createUserWithCharacter(user: UserInput, character: CharacterInput): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract temp__(): boolean | Promise<boolean>;
}

export type Date = any;
export type Upload = any;
