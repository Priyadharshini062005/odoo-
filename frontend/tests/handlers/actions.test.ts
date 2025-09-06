import {
  loginUser,
  initialStoreAction,
  initialStoreDefaultAction,
  increaseCountState,
} from "../../src/handlers/redux/actions";

import {
  LOG_IN,
  INIT_STORE,
  INIT_STORE_DEFAULT,
  INCREASE_COUNT,
} from "../../src/handlers/redux/actions-constants";

describe("actions", () => {
  it("loginUser should create a LOG_IN action", () => {
    const email = "test@example.com";
    const password = "pass123";
    const expectedAction = {
      type: LOG_IN,
      payload: { email, password },
    };
    expect(loginUser(email, password)).toEqual(expectedAction);
  });

  it("initialStoreAction should create INIT_STORE action with payload", () => {
    const state = {
      user: {
        name: "John",
        email: "john@example.com",
        password: "pass",
        accessToken: "abc",
        refreshToken: "def",
        phone: "123456",
        address: "somewhere",
        avatar: "avatar.png",
      },
    };
    const expectedAction = {
      type: INIT_STORE,
      payload: state,
    };
    expect(initialStoreAction(state)).toEqual(expectedAction);
  });

  it("initialStoreDefaultAction should create INIT_STORE_DEFAULT with empty payload", () => {
    const expectedAction = {
      type: INIT_STORE_DEFAULT,
      payload: {},
    };
    expect(initialStoreDefaultAction()).toEqual(expectedAction);
  });

  it("increaseCountState should create INCREASE_COUNT action with payload", () => {
    const newCount = 5;
    const expectedAction = {
      type: INCREASE_COUNT,
      payload: newCount,
    };
    expect(increaseCountState(newCount)).toEqual(expectedAction);
  });
});
