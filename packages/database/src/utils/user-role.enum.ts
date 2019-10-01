// tslint:disable:no-bitwise
export enum UserRole {
  LoggedIn = 0,
  Admin = 1 << 0,
  SuperAdmin = 1 << 1,
}