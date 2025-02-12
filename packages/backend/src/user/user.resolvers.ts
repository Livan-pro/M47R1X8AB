import { Resolver, Mutation, Args, Context, Query, ResolveProperty, Parent } from "@nestjs/graphql";
import { Logger, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "auth/auth.service";
import { CreateUser, CreateCharacter, EditUser, ChangePassword } from "shared/node";
import { Response } from "express";
import { GetUser } from "./get-user.decorator";
import { User, UserRole as Role, Character, CharacterState, EventType } from "matrix-database";
import { LoginResult, UserRole as GqlRole, EditUserInput } from "graphql.schema";
import { CustomError } from "CustomError";
import { Roles } from "auth/roles.decorator";
import { CharacterService } from "character/character.service";
import { Config } from "config";
import { EventService } from "event/event.service";

@Resolver("User")
export class UserResolvers {
  private readonly log = new Logger(UserResolvers.name);
  private readonly radioUrl: string | null = Config.get("RADIO_URL", null);
  constructor(
    private readonly user: UserService,
    private readonly auth: AuthService,
    private readonly character: CharacterService,
    private readonly event: EventService,
  ) {}

  @ResolveProperty()
  roles(@Parent() user: User) {
    return user.roles.toStringArray();
  }

  @ResolveProperty()
  async characters(@Parent() user: User, @GetUser() me: User) {
    if (user.id !== me.id && !me.roles.has(Role.Admin)) return null;
    return await this.character.findByOwner(user.id);
  }

  @Mutation()
  async createUserWithCharacter(
    @Args("user", ValidationPipe) userData: CreateUser,
    @Args("character") characterData: CreateCharacter,
  ): Promise<boolean> {
    throw new CustomError("Предварительная регистрация закрыта. Вы можете зарегистрироваться на полигоне");
    try {
      const uData = {...userData, birthday: new Date(0)};
      uData.password = await this.auth.hashPassword(uData.password);
      const cData = {...characterData, age: 0};
      await this.user.createWithCharacter(uData, cData);
      await this.event.emit(null, null, null, null, EventType.CreateUserWithCharacter, {userData, characterData});
      return true;
    } catch (err) {
      if (err.errno === 1062) throw new CustomError("Пользователь с таким email уже зарегистрирован!");
      throw err;
    }
  }

  @Mutation()
  async login(
    @Args("email") email: string,
    @Args("password") password: string,
    @Args("rememberMe") rememberMe: boolean,
    @Args("admin") admin: boolean,
    @Context("res") res: Response | undefined,
  ): Promise<LoginResult> {
    let user: User;
    try {
      user = await this.user.getByEmail(email);
    } catch (err) {
      throw new CustomError("Неверный логин или пароль");
    }
    if (admin && !user.roles.has(Role.Admin)) throw new CustomError("Неверный логин или пароль");
    if (!await this.auth.verifyPassword(password, user.password)) throw new CustomError("Неверный логин или пароль");
    const token = await this.auth.createToken(email, rememberMe);
    if (res && res.cookie) res.cookie("token", token.token, { expires: token.expires, httpOnly: true });
    await this.event.emit(null, user.id, null, user.id, EventType.Login, {rememberMe});
    return {
      email: user.email,
      token: token.token,
    };
  }

  @Mutation("logout")
  async logout(@Context("res") res: Response): Promise<boolean> {
    res.clearCookie("token");
    await this.event.emit(null, null, null, null, EventType.Logout);
    return true;
  }

  @Query("me")
  @Roles({user: Role.LoggedIn})
  async me(@GetUser() user: User): Promise<User> {
    this.log.log(`Me: ${user.email}`);
    return user;
  }

  @Query("users")
  @Roles({user: Role.Admin})
  async users(@GetUser() user: User): Promise<User[]> {
    return await this.user.getAllWithMainCharacter();
  }

  @Query("radioUrl")
  @Roles({user: Role.LoggedIn})
  async getRadioUrl(): Promise<string> {
    return this.radioUrl;
  }

  @Mutation()
  @Roles({user: Role.LoggedIn})
  async editUser(
    @Args("user" , new ValidationPipe({
      skipMissingProperties: true,
    })) userData: EditUser,
    @GetUser() user: User,
  ): Promise<boolean> {
    await this.user.update(user.id, userData);
    await this.event.emit(null, user.id, null, user.id, EventType.EditUser, userData);
    return true;
  }

  @Mutation()
  @Roles({user: Role.LoggedIn})
  async changePassword(
    @Args("data", ValidationPipe) data: ChangePassword,
    @GetUser() user: User,
  ): Promise<boolean> {
    if (!await this.auth.verifyPassword(data.currentPassword, user.password)) throw new CustomError("Неверный пароль");
    await this.user.update(user.id, {
      password: await this.auth.hashPassword(data.password),
      passwordChangedAt: new Date(),
    });
    await this.event.emit(null, user.id, null, user.id, EventType.ChangePassword);
    return true;
  }

  @Mutation()
  @Roles({user: Role.SuperAdmin})
  async setUserRole(
    @Args("id") id: number,
    @Args("role") role: GqlRole,
    @Args("value") value: boolean,
    @GetUser() user: User,
  ): Promise<boolean> {
    const u = await this.user.getById(id);
    if (value) {
      if (u.roles.has(Role[role])) return false;
      u.roles = u.roles.add(Role[role]);
    } else {
      if (!u.roles.has(Role[role])) return false;
      u.roles = u.roles.remove(Role[role]);
    }
    await this.user.update(id, {roles: u.roles});
    await this.event.emit(null, user.id, null, id, EventType.SetUserRole, {roles: u.roles});
    return true;
  }

  @Mutation()
  @Roles({user: Role.LoggedIn})
  async setMainCharacter(
    @Args("characterId") characterId: number,
    @GetUser() user: User,
  ): Promise<Character> {
    let character: Character;
    try {
      character = await this.character.getByIdAndOwner(characterId, user.id, ["location"]);
    } catch (e) {
      throw new CustomError("Этот персонаж не принадлежит вам");
    }
    const data = {mainCharacterId: character.id};
    await this.user.update(user.id, data);
    await this.event.emit(null, user.id, null, null, EventType.SetMainCharacter, data);
    return character;
  }

  @Mutation()
  @Roles({user: Role.Admin})
  async updateUser(
    @Args("id") id: number,
    @Args("data") data: EditUserInput,
    @GetUser() user: User,
  ): Promise<Partial<User>> {
    await this.user.update(id, data);
    await this.event.emit(null, user.id, null, null, EventType.UpdateUser, {id, ...data});
    return {...data, id};
  }

  @Mutation()
  @Roles({user: Role.Admin})
  async setPassword(
    @Args("id") id: number,
    @Args("password") password: string,
    @GetUser() user: User,
  ): Promise<boolean> {
    await this.user.update(id, {
      password: await this.auth.hashPassword(password),
      passwordChangedAt: new Date(),
    });
    await this.event.emit(null, user.id, null, id, EventType.ChangePassword);
    return true;
  }
}
