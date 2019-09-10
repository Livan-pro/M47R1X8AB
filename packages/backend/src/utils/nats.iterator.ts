import { Client } from "nats";
import { Deferred } from "./deferred";

export class NatsAsyncIterator<T>  implements AsyncIterator<T> {
  private sid: number;
  private queue: T[] = [];
  private deferred: Deferred<void>;

  constructor(private readonly nats: Client, private readonly subject: string, private readonly name: string) {}

  public async next(): Promise<IteratorResult<T>> {
    if (this.sid === undefined) this._subscribe();
    while (!this.queue.length) {
      if (!this.deferred) this.deferred = new Deferred();
      await this.deferred.promise;
    }
    this.deferred = undefined;
    return { value: this.queue.shift(), done: false};
  }

  public async return(): Promise<IteratorResult<T>> {
    this.unsubscribe();
    return { value: undefined, done: true };
  }

  public async throw(error) {
    this.unsubscribe();
    return Promise.reject(error);
  }

  private _subscribe() {
    if (this.sid !== undefined) return;
    this.sid = this.nats.subscribe(this.subject, (data: any) => this.onMessage({[this.name]: data} as T));
  }

  private unsubscribe() {
    if (this.sid === undefined) return;
    this.nats.unsubscribe(this.sid);
    this.sid = undefined;
    this.queue = [];
  }

  private onMessage(data: T) {
    this.queue.push(data);
    console.log("onMessage", data);
    if (this.deferred) this.deferred.resolve();
  }
}
