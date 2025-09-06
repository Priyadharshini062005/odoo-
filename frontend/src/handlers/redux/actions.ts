/**
 * @description: This file contains action functions for this redux store state updates.
 *               To update the data in redux storage, API calls will be made in some of the action functions.
 */
import {
  INCREASE_COUNT,
  INIT_STORE,
  INIT_STORE_DEFAULT,
  LOG_IN,
} from "./actions-constants";
import { IActions, IState } from "./interfaces";

/**
 * @param email: email provides email of the user for login
 * @param password: password will be password of the user.
 * @returns it returns an object which contains action type and state payload count with new value for store to update.
 */
export function loginUser(email: string, password: string): IActions {
  return { type: LOG_IN, payload: { email, password } };
}

/**
 *
 * @param state: state parameter will store the initial state of the redux store.
 * @returns it returns an object which contains action type and state payload for store to update.
 */
export function initialStoreAction(state: IState): IActions {
  return { type: INIT_STORE, payload: state };
}

/**
 *
 * @returns it returns an object which contains action type and and empty state payload for store to update with empty object.
 */
export function initialStoreDefaultAction(): IActions {
  return { type: INIT_STORE_DEFAULT, payload: {} };
}

/**
 *
 * @param newCount: newCount provides the updated count number of the counter
 * @returns it returns an object which contains action type and state payload count with new value for store to update.
 */
export function increaseCountState(newCount: number): IActions {
  return { type: INCREASE_COUNT, payload: newCount };
}
