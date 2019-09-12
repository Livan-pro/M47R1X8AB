export class Deferred<T> {
  // tslint:disable-next-line: variable-name
  private readonly _promise: Promise<T>;
  // tslint:disable-next-line: variable-name
  private _resolve: (value?: T) => void;
  // tslint:disable-next-line: variable-name
  private _reject: (error: Error) => void;

  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._reject = reject;
      this._resolve = resolve;
    });
  }

  get promise() {
    return this._promise;
  }

  get resolve() {
    return this._resolve;
  }

  get reject() {
    return this._reject;
  }
}
