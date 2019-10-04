import { Resolver, Query, Mutation, Args, Subscription } from "@nestjs/graphql";
import { Logger, Inject } from "@nestjs/common";
import { MessageService } from "./message.service";
import { Message, MessageInput, Chat, Character, ChatUpdate } from "graphql.schema";
import { UserRole as Role, User, CharacterState, EventType } from "matrix-database";
import { Roles } from "auth/roles.decorator";
import { GetUser } from "user/get-user.decorator";
import { EventService } from "event/event.service";
import { CharacterService } from "character/character.service";
import { NatsAsyncIterator } from "utils/nats.iterator";
import { Client } from "nats";
import { UserCacheService } from "cache/user-cache.service";
import { MessageCacheService } from "cache/message-cache.service";

@Resolver()
@Roles({user: Role.Admin}, {state: [CharacterState.Normal, CharacterState.Pollution]})
export class MessageResolvers {
  private readonly log = new Logger(MessageResolvers.name);
  constructor(
    private readonly message: MessageService,
    private readonly event: EventService,
    private readonly character: CharacterService,
    private readonly uCache: UserCacheService,
    private readonly mCache: MessageCacheService,
    @Inject("NATS") private readonly nats: Client,
  ) {}

  @Query("chats")
  async chats(@GetUser() user: User): Promise<Chat[]> {
    const lastMessages = await this.message.getLastMessagesForCharacter(user.mainCharacterId);
    const ids = lastMessages.reduce((arr, msg) => {
      if (arr.indexOf(msg.fromId) < 0) arr.push(msg.fromId);
      if (arr.indexOf(msg.toId) < 0) arr.push(msg.toId);
      return arr;
    }, []);
    const participants = (await this.character.getByIds(ids, ["id", "name", "avatarUploadedAt"]))
      .reduce((obj, char) => ({...obj, [char.id]: char}), {});
    return lastMessages.map(message => ({
      id: message.fromId === user.mainCharacterId ? message.toId : message.fromId,
      participants: [participants[message.fromId], participants[message.toId]],
      lastMessage: message,
    }));
  }

  @Query("messages")
  async messages(
    @Args("chatId") chatId: number,
    @Args("beforeId") beforeId: number,
    @GetUser() user: User,
  ): Promise<Message[]> {
    return await this.message.getForChat(chatId, user.mainCharacterId);
  }

  @Query("chat")
  async chat(
    @Args("id") id: number,
    @GetUser() user: User,
  ): Promise<Chat | null> {
    const lastMessage = await this.message.getLastMessageForChat(id, user.mainCharacterId);
    const participants = await this.character.getByIds(
      [id, user.mainCharacterId],
      ["id", "userId", "name", "avatarUploadedAt"],
    ) as unknown as Character[];
    return {id, participants, lastMessage};
  }

  @Mutation("sendMessage")
  async sendMessage(
    @Args("chatId") chatId: number,
    @Args("message") msg: MessageInput,
    @GetUser() user: User,
  ): Promise<Message> {
    const message = await this.message.send(user.mainCharacterId, chatId, msg);
    this.event.emit(user.mainCharacterId, user.id, chatId, null, EventType.NewMessage, message);
    return message;
  }

  @Mutation("broadcastMessage")
  async broadcastMessage(
    @Args("text") text: string,
    @GetUser() user: User,
  ): Promise<boolean> {
    await this.event.emit(user.mainCharacterId, user.id, null, null, EventType.BroadcastMessage, {text});
    return true;
  }

  @Subscription("messages", {
    filter(this: MessageResolvers, payload: {messages: Message}, variables: {chatId: number}, ctx: {req: {user: User}}) {
      const characterId = this.uCache.getMainCharacterId(ctx.req.user.id);
      return (payload.messages.fromId === variables.chatId && payload.messages.toId === characterId) ||
      (payload.messages.toId === variables.chatId && payload.messages.fromId === characterId);
    },
    resolve: data => {
      return {...data.messages, createdAt: new Date(data.messages.createdAt)};
    },
  })
  sMessages(@Args("chatId") chatId: number, @GetUser() user: User) {
    return new NatsAsyncIterator(this.nats, "*.message.new", "messages");
  }

  @Subscription("chats", {
    filter(this: MessageResolvers, payload: {message: Message}, _, ctx: {req: {user: User}}) {
      const characterId = this.uCache.getMainCharacterId(ctx.req.user.id);
      return payload.message.toId === characterId || payload.message.fromId === characterId;
    },
    async resolve(this: MessageResolvers, {message}: {message: Message}, _, ctx: {req: {user: User}}): Promise<ChatUpdate> {
      let participants: null | Character[] = null;
      const characterId = this.uCache.getMainCharacterId(ctx.req.user.id);
      const chatId = message.fromId === characterId ? message.toId : message.fromId;
      message.createdAt = new Date(message.createdAt);
      if (this.mCache.isFirstInChat(characterId, chatId, message.id)) {
        participants = await this.character.getByIds(
          [characterId, chatId],
          ["id", "userId", "name", "avatarUploadedAt"],
        ) as unknown as Character[];
      }
      return {id: chatId, lastMessage: message, participants};
    },
  })
  sChats(@GetUser() user: User) {
    return new NatsAsyncIterator(this.nats, "*.message.new", "message");
  }

  @Subscription("notifications", {
    filter(this: MessageResolvers, payload: {notifications: {userIds: string | number[], title: string, body: string, data: any}}, _, ctx: {req: {user: User}}) {
      return typeof payload.notifications.userIds === "string" ?
        payload.notifications.userIds === "*" :
        payload.notifications.userIds.includes(ctx.req.user.id);
    },
    resolve: data => {
      return {title: data.notifications.title, body: data.notifications.body, data: JSON.stringify(data.notifications.data)};
    },
  })
  sNotifications() {
    return new NatsAsyncIterator(this.nats, "*.notification", "notifications");
  }
}
