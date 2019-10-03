import { Service, Inject } from "typedi";
import { Logger } from "pino";
import { Client } from "nats";
import { Event, EventType, Character } from "matrix-database";
import { messaging } from "firebase-admin";
import { TokenCacheService } from "./token-cache";
import { CharacterCacheService } from "./character-cache";
import { items } from "../items";

interface INotificationDescription<T> {
  type: EventType;
  data?: T;
  sendTo?: "affected" | "all";
  handler: (event: Event & {data: T}) => false | string | {title?: string; body: string; data?: NotificationData};
}

type NotificationData = {[key: string]: string} | null;

@Service()
export class NotifierService {
  private log: Logger;
  @Inject("NATS") private nats: Client;
  @Inject("MESSAGING") private messaging: messaging.Messaging;
  @Inject() private cache: TokenCacheService;
  @Inject() private charCache: CharacterCacheService;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifications: {[key: string]: INotificationDescription<any>} = Object.freeze([

    {
      type: EventType.AddBalance,
      data: {
        amount: 0,
      },
      handler: ({data: {amount}}) => amount === 0 ? false : amount > 0 ? `Вам зачислено ${amount} кредитов!` : `С вас списано ${-amount} кредитов!`,
    } as INotificationDescription<{amount: number}>,
    {
      type: EventType.AddItem,
      data: {
        itemId: 0,
        amount: 0,
      },
      handler: ({data: {itemId, amount}}) => amount === 0 ?
        false : amount > 0 ? `Вам выдан ${items[itemId]} (${amount})!` : `С вас списан ${items[itemId]} (${-amount})!`,
    } as INotificationDescription<{itemId: number; amount: number}>,
    {
      type: EventType.CreateImplant,
      handler: ({causedByCharacterId}: Event) => `${this.charCache.getNameByCharacterId(causedByCharacterId)} создал имплант для вас!`,
    } as INotificationDescription<void>,
    {
      type: EventType.CreateNews,
      sendTo: "all",
      data: {
        title: "",
      },
      handler: ({data: {title}}) => ({title: "Новости", body: title}),
    } as INotificationDescription<{title: string}>,
    {
      type: EventType.DeathBySevereWound,
      handler: () => "Вы умерли :(",
    } as INotificationDescription<void>,
    {
      type: EventType.FixImplants,
      handler: ({causedByCharacterId}: Event) => `${this.charCache.getNameByCharacterId(causedByCharacterId)} починил ваши импланты!`,
    } as INotificationDescription<void>,
    {
      type: EventType.GetPollutionByHomeless,
      handler: () => "Вы получили загрязнение!",
    } as INotificationDescription<void>,
    {
      type: EventType.GetSevereWoundByPollution,
      handler: () => "Вы получили тяжёлое ранение!",
    } as INotificationDescription<void>,
    {
      type: EventType.Heal,
      handler: ({causedByCharacterId}: Event) => `${this.charCache.getNameByCharacterId(causedByCharacterId)} вылечил вас!`,
    } as INotificationDescription<void>,
    {
      type: EventType.NewMessage,
      data: {
        fromId: 0,
        toId: 0,
        text: "",
      },
      handler: ({type, data: {fromId, toId, text}}) => ({
        title: this.charCache.getNameByCharacterId(fromId),
        body: text,
        data: {
          type,
          chatId: toId.toString(),
        },
      }),
    } as INotificationDescription<{fromId: number; toId: number; text: string}>,
    {
      type: EventType.RejectImplants,
      handler: () => "Ваши импланты отторглись...",
    } as INotificationDescription<void>,
    {
      type: EventType.TransferItem,
      data: {
        itemId: 0,
        amount: 0,
      },
      handler: ({causedByCharacterId, data: {itemId, amount}}) =>
        `${this.charCache.getNameByCharacterId(causedByCharacterId)} отправил вам ${items[itemId]} (${amount})!`,
    } as INotificationDescription<{itemId: number; amount: number}>,
    {
      type: EventType.TransferMoney,
      data: {
        amount: 0,
      },
      handler: ({causedByCharacterId, data: {amount}}) =>
        `${this.charCache.getNameByCharacterId(causedByCharacterId)} отправил вам ${amount} кредитов!`,
    } as INotificationDescription<{amount: number}>,

  ].map(desc => Object.hasOwnProperty.call(desc, "sendTo") ? desc : {...desc, sendTo: "affected"}).reduce((obj, desc) => {
    obj[desc.type] = desc;
    return obj;
  }, {}));

  constructor(
    @Inject("LOGGER") logger: Logger,
  ) {
    this.log = logger.child({scope: NotifierService.name});
  }

  async init() {
    this.nats.subscribe("*.event.*", (event: Event) => this.onEvent(event));
  }

  private async onEvent(event: Event) {
    const desc = this.notifications[event.type];
    if (!desc) return;
    const input = event.data;
    if (typeof desc.data === "object") {
      for (const key of Object.keys(desc.data)) {
        if (!Object.prototype.hasOwnProperty.call(input, key)) {
          this.log.warn(`Event data field missing: ${key} (${event.type})`);
          return;
        }
        if (typeof input[key] !== typeof desc.data[key]) {
          this.log.warn(`Event data field has incorrect type: ${key} (${event.type}).` +
            ` Type: ${typeof input[key]}. Expected: ${typeof desc.data[key]}`);
          return;
        }
      }
    }
    const output = this.notifications[event.type].handler(event);
    if (output === false) return;
    let notification: messaging.Notification = {};
    let data: NotificationData = null;
    if (typeof output === "string") {
      notification.body = output;
    } else {
      const {title, body} = output;
      notification = {title, body};
      data = output.data;
    }
    if (!notification.title)
      notification.title = event.affectedCharacterId ? this.charCache.getNameByCharacterId(event.affectedCharacterId) : "Матрица 2219";
    if (desc.sendTo === "all") await this.sendNotificationToAll(notification, data);
    else if (!event.affectedUserId) {
      this.log.warn(`Affected user id is null for event ${event.type} (ID${event.id})`);
    } else await this.sendNotification(event.affectedUserId, notification, data);
  }

  private async sendNotification(userId: number, notification: messaging.Notification, data?: NotificationData) {
    this.sendBatchNotification(this.cache.getTokensByUserId(userId), notification, data);
  }

  private async sendNotificationToAll(notification: messaging.Notification, data?: NotificationData) {
    this.sendBatchNotification(this.cache.getAllTokens(), notification, data);
  }

  private async sendBatchNotification(tokens: string[], notification: messaging.Notification, data?: NotificationData) {
    if (!tokens || tokens.length < 1) return;
    const info = data ? {notification, data} : {notification};
    for (let i = 0; i < tokens.length; i += 100) {
      const response = await this.messaging.sendMulticast({tokens: tokens.slice(i, i + 100), ...info});
      if (response.failureCount > 0) this.log.warn({errors: response.responses.filter(r => !r.success)});
    }
  }
}