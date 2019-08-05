// tslint:disable:no-bitwise
export enum Role {
  LoggedIn = 0,
  Admin = 1 << 0,
  SuperAdmin = 1 << 1,
}