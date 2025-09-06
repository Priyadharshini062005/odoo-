import {
  defaultReducer,
  initialState,
  counterReducer,
} from "../../src/handlers/redux/reducers";
import rootReducer from "../../src/handlers/redux/reducers";
import {
  INIT_STORE,
  INIT_STORE_DEFAULT,
  INCREASE_COUNT,
} from "../../src/handlers/redux/actions-constants";

describe("defaultReducer", () => {
  it("should return initial state when action type is unknown", () => {
    const result = defaultReducer(undefined, { type: "UNKNOWN" } as any);
    expect(result).toEqual(initialState);
  });

  it("should reset to initial state with INIT_STORE_DEFAULT", () => {
    const modifiedState = {
      ...initialState,
      user: { ...initialState.user, name: "Test" },
    };
    const result = defaultReducer(modifiedState, {
      type: INIT_STORE_DEFAULT,
    } as any);
    expect(result).toEqual(initialState);
  });

  it("should set state with INIT_STORE payload", () => {
    const payload = {
      user: {
        ...initialState.user,
        name: "John",
        email: "john@example.com",
      },
    };
    const result = defaultReducer(undefined, { type: INIT_STORE, payload });
    expect(result).toEqual(payload);
  });
});

describe("counterReducer", () => {
  it("should return default count of 0", () => {
    const result = counterReducer(undefined, { type: "UNKNOWN" } as any);
    expect(result).toBe(0);
  });

  it("should increment count by 1 on INCREASE_COUNT", () => {
    const result = counterReducer(5, { type: INCREASE_COUNT } as any);
    expect(result).toBe(6);
  });
});

describe("rootReducer", () => {
  it("should initialize state with combined reducers", () => {
    const state = rootReducer(undefined, { type: "@@INIT" });
    expect(state).toHaveProperty("auth");
    expect(state).toHaveProperty("blogs");
    expect(state).toHaveProperty("products");
    expect(state).toHaveProperty("carts");
  });
});
