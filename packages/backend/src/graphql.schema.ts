
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export enum AttachmentType {
    Image = "Image",
    Video = "Video",
    Audio = "Audio"
}

export enum CharacterRole {
    None = "None",
    Netrunner = "Netrunner",
    Medic = "Medic",
    Technician = "Technician",
    Replicant = "Replicant",
    Android = "Android",
    NPC = "NPC"
}

export enum CharacterState {
    Normal = "Normal",
    Pollution = "Pollution",
    SevereWound = "SevereWound",
    Death = "Death"
}

export enum ImplantType {
    Limb = "Limb",
    Brain = "Brain",
    Internal = "Internal"
}

export enum Profession {
    None = "None",
    Netrunner = "Netrunner",
    Medic = "Medic",
    Chemist = "Chemist",
    Marshal = "Marshal",
    Hitman = "Hitman",
    Biotechnician = "Biotechnician",
    Employee = "Employee",
    Engineer = "Engineer",
    Stalker = "Stalker",
    Mutant = "Mutant"
}

export enum UserRole {
    Admin = "Admin",
    SuperAdmin = "SuperAdmin"
}

export class AttachmentInput {
    file: Upload;
    type: AttachmentType;
}

export class ChangePasswordInput {
    currentPassword: string;
    password: string;
    passwordConfirmation: string;
}

export class CharacterInput {
    name?: string;
    quenta?: Upload;
    registrationProfession?: Profession;
}

export class EditUserInput {
    firstName?: string;
    lastName?: string;
    phone?: string;
    vkId?: string;
    medicalInfo?: string;
    city?: string;
}

export class FullCharacterInput {
    name?: string;
    quenta?: Upload;
    roles?: CharacterRole[];
    profession?: Profession;
    registrationProfession?: Profession;
    professionLevel?: number;
    balance?: number;
    state?: CharacterState;
    pollution?: number;
    deathTime?: Date;
    implantsRejectTime?: Date;
    locationId?: number;
}

export class FullImplantInput {
    characterId?: number;
    name?: string;
    type?: ImplantType;
    working?: boolean;
    quality?: boolean;
}

export class LocationInput {
    name?: string;
}

export class LoginInput {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export class MessageInput {
    text: string;
}

export class NewsInput {
    title?: string;
    text?: string;
    datetime?: Date;
    attachment?: AttachmentInput;
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
    city?: string;
}

export class Attachment {
    id: string;
    name: string;
    type: AttachmentType;
}

export class BalanceTransfer {
    id: number;
    createdAt: Date;
    from?: Character;
    to: Character;
    amount: number;
}

export class Character {
    id: number;
    userId?: number;
    name: string;
    quenta?: string;
    roles?: CharacterRole[];
    profession?: Profession;
    registrationProfession?: Profession;
    professionLevel?: number;
    own: boolean;
    avatarUploadedAt?: Date;
    balance?: number;
    state?: CharacterState;
    pollution?: number;
    deathTime?: Date;
    implantsRejectTime?: Date;
    location?: Location;
    properties: Property[];
}

export class CharacterUpdate {
    id?: number;
    name?: string;
    quenta?: string;
    roles?: CharacterRole[];
    profession?: Profession;
    registrationProfession?: Profession;
    professionLevel?: number;
    avatarUploadedAt?: Date;
    balance?: number;
    state?: CharacterState;
    pollution?: number;
    deathTime?: Date;
    implantsRejectTime?: Date;
    location?: Location;
    properties?: Property[];
}

export class Chat {
    id: number;
    participants: Character[];
    lastMessage?: Message;
}

export class ChatUpdate {
    id: number;
    participants?: Character[];
    lastMessage?: Message;
}

export class Implant {
    id: number;
    name?: string;
    type?: ImplantType;
    working?: boolean;
    quality?: boolean;
}

export class ImplantProlongation {
    id: number;
    createdAt: Date;
    code: string;
    usedBy?: Character;
    usedAt?: Date;
    time: number;
}

export class ImplantUpdate {
    _id: number;
    name?: string;
    type?: ImplantType;
    working?: boolean;
    quality?: boolean;
}

export class InventoryItem {
    itemId: number;
    amount: number;
}

export class ItemGift {
    id: number;
    createdAt: Date;
    code: string;
    usedBy?: Character;
    usedAt?: Date;
    itemId: number;
    amount: number;
}

export class Location {
    id?: number;
    name: string;
}

export class LoginResult {
    email: string;
    token: string;
}

export class Medicine {
    id: number;
    createdAt: Date;
    code: string;
    usedBy?: Character;
    usedAt?: Date;
}

export class Medpack {
    id: number;
    createdAt: Date;
    code: string;
    usedBy?: Character;
    usedAt?: Date;
}

export class Message {
    id: number;
    createdAt: Date;
    fromId: number;
    toId: number;
    text: string;
}

export abstract class IMutation {
    abstract moneyTransfer(id: number, amount: number): Character | Promise<Character>;

    abstract addBalance(id: number, amount: number): Character | Promise<Character>;

    abstract editCharacter(id: number, character: CharacterInput): boolean | Promise<boolean>;

    abstract uploadAvatar(id: number, avatar: string): Date | Promise<Date>;

    abstract suicide(): Date | Promise<Date>;

    abstract updateCharacter(id: number, data: FullCharacterInput): Character | Promise<Character>;

    abstract editProperty(characterId: number, name: string, value: string): boolean | Promise<boolean>;

    abstract setFirebaseToken(token: string): boolean | Promise<boolean>;

    abstract unsetFirebaseToken(token: string): boolean | Promise<boolean>;

    abstract createImplant(data: FullImplantInput): Implant | Promise<Implant>;

    abstract updateImplant(id: number, data: FullImplantInput): Implant | Promise<Implant>;

    abstract prolongImplants(code: string): boolean | Promise<boolean>;

    abstract fixImplants(characterId: number): Character | Promise<Character>;

    abstract createImplantProlongation(code: string, time: number): ImplantProlongation | Promise<ImplantProlongation>;

    abstract transferItem(to: number, itemId: number, amount: number): boolean | Promise<boolean>;

    abstract addItems(characterId: number, itemId: number, amount: number): InventoryItem | Promise<InventoryItem>;

    abstract useItemGift(code: string): InventoryItem | Promise<InventoryItem>;

    abstract createItemGift(code: string, itemId: number, amount: number): ItemGift | Promise<ItemGift>;

    abstract consumeItem(itemId: number, amount: number): InventoryItem | Promise<InventoryItem>;

    abstract createLocation(data: LocationInput): Location | Promise<Location>;

    abstract updateLocation(id: number, data: LocationInput): Location | Promise<Location>;

    abstract useMedicine(code: string): boolean | Promise<boolean>;

    abstract useMedpack(code: string): boolean | Promise<boolean>;

    abstract heal(characterId: number): Character | Promise<Character>;

    abstract createMedicine(code: string): Medicine | Promise<Medicine>;

    abstract createMedpack(code: string): Medpack | Promise<Medpack>;

    abstract sendMessage(chatId: number, message: MessageInput): Message | Promise<Message>;

    abstract broadcastMessage(text: string): boolean | Promise<boolean>;

    abstract createNews(data: NewsInput): News | Promise<News>;

    abstract updateNews(id: number, data: NewsInput): News | Promise<News>;

    abstract deleteNews(ids: number[]): boolean | Promise<boolean>;

    abstract createUserWithCharacter(user: UserInput, character: CharacterInput): boolean | Promise<boolean>;

    abstract login(email: string, password: string, rememberMe?: boolean, admin?: boolean): LoginResult | Promise<LoginResult>;

    abstract logout(): boolean | Promise<boolean>;

    abstract editUser(user: EditUserInput): boolean | Promise<boolean>;

    abstract changePassword(data: ChangePasswordInput): boolean | Promise<boolean>;

    abstract setUserRole(id: number, role: UserRole, value?: boolean): boolean | Promise<boolean>;

    abstract setMainCharacter(characterId: number): Character | Promise<Character>;

    abstract updateUser(id: number, data?: EditUserInput): User | Promise<User>;

    abstract setPassword(id: number, password: string): boolean | Promise<boolean>;
}

export class News {
    id: number;
    title: string;
    text: string;
    datetime: Date;
    attachment?: Attachment;
}

export class Property {
    name: string;
    value: string;
}

export abstract class IQuery {
    abstract none(): boolean | Promise<boolean>;

    abstract allBalanceHistory(): BalanceTransfer[] | Promise<BalanceTransfer[]>;

    abstract characters(): Character[] | Promise<Character[]>;

    abstract character(id: number): Character | Promise<Character>;

    abstract implants(id?: number): Implant[] | Promise<Implant[]>;

    abstract listImplantProlongation(): ImplantProlongation[] | Promise<ImplantProlongation[]>;

    abstract listItemGift(): ItemGift[] | Promise<ItemGift[]>;

    abstract inventory(id?: number): InventoryItem[] | Promise<InventoryItem[]>;

    abstract locations(): Location[] | Promise<Location[]>;

    abstract listMedpack(): Medpack[] | Promise<Medpack[]>;

    abstract listMedicine(): Medicine[] | Promise<Medicine[]>;

    abstract messages(chatId: number, beforeId?: number): Message[] | Promise<Message[]>;

    abstract chats(): Chat[] | Promise<Chat[]>;

    abstract chat(id: number): Chat | Promise<Chat>;

    abstract news(): News[] | Promise<News[]>;

    abstract me(): User | Promise<User>;

    abstract users(): User[] | Promise<User[]>;

    abstract radioUrl(): string | Promise<string>;
}

export abstract class ISubscription {
    abstract mainCharacter(): CharacterUpdate | Promise<CharacterUpdate>;

    abstract implants(): ImplantUpdate | Promise<ImplantUpdate>;

    abstract messages(chatId: number): Message | Promise<Message>;

    abstract chats(): ChatUpdate | Promise<ChatUpdate>;
}

export class User {
    id: number;
    email?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    vkId?: string;
    medicalInfo?: string;
    city?: string;
    characters?: Character[];
    mainCharacter?: Character;
    roles?: UserRole[];
    createdAt?: Date;
}

export type Upload = any;
