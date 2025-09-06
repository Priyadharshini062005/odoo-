/**
 * @description: This file contains interfaces for types of objects. These interfaces are used throughout the app for strict type.
 */

export interface IState {
  user: IStateUser;
}

// This interface actions is used in store actions to dispatch and event.
export interface IActions {
  type: string;
  payload: any;
}

// This interface is used for user to hold user's data and tokens on front-end.
export interface IStateUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  avatar: string;
  accessToken: string;
  refreshToken: string;
}
