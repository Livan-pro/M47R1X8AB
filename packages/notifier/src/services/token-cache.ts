import { Service, Inject } from "typedi";
import { Logger } from "pino";
import { Client } from "nats";
import { Event, FirebaseToken } from "matrix-database";
import { Connection, Repository } from "typeorm";

@Service()
export class TokenCacheService {
  private log: Logger;
  @Inject("NATS") private nats: Client;
  private readonly repo: Repository<FirebaseToken>;
  private readonly tokens = new Map<number, string[]>(); // key = userId, value = token[]
  private readonly userId = new Map<string, number>(); // key = token, value = userId

  constructor(
    @Inject("LOGGER") logger: Logger,
    @Inject("CONNECTION") connection: Connection,
  ) {
    this.log = logger.child({scope: TokenCacheService.name});
    this.repo = connection.getRepository<FirebaseToken>(FirebaseToken);
  }

  async init() {
    this.nats.subscribe("*.event.SetFirebaseToken", (event: Event) => this.onSetToken(event));
    this.nats.subscribe("*.event.UnsetFirebaseToken", (event: Event) => this.onUnsetToken(event));
    const tokens = await this.repo.find();
    for (const token of tokens) {
      this.addToken(token.token, token.userId);
    }
  }

  public getTokensByUserId(userId: number) {
    return this.tokens.get(userId);
  }

  public getUserIdByToken(token: string) {
    return this.userId.get(token);
  }

  public getAllTokens() {
    return Array.from(this.userId.keys());
  }

  private onSetToken(event: Event) {
    if (!event || !event.data) return;
    const data = event.data as {token: string; userId: number};
    if (typeof data.token !== "string" || typeof data.userId !== "number") return;
    this.addToken(data.token, data.userId);
  }

  private onUnsetToken(event: Event) {
    if (!event || !event.data) return;
    const data = event.data as {token: string; userId: number};
    if (typeof data.token !== "string") return;
    this.removeToken(data.token);
  }

  private addToken(token: string, userId: number) {
    this.userId.set(token, userId);
    const arr = this.tokens.get(userId);
    if (!arr) this.tokens.set(userId, [token]);
    else {
      if (arr.indexOf(token) > -1) return;
      arr.push(token);
    }
  }

  private removeToken(token: string) {
    const userId = this.userId.get(token);
    if (!userId) return;
    this.userId.delete(token);
    const arr = this.tokens.get(userId);
    if (!arr) return;
    else {
      const idx = arr.indexOf(token);
      if (idx < 0) return;
      arr.splice(idx, 1);
      if (arr.length < 1) this.tokens.delete(userId);
    }
  }
}