import { makeStore } from "../../src/handlers/redux/store";
import { persistReducer } from "redux-persist";

jest.mock("redux-persist", () => {
  const actual = jest.requireActual("redux-persist");
  return {
    ...actual,
    persistReducer: jest.fn((config, reducers) => reducers), // mock out persistReducer to just return the reducer
  };
});

describe("Redux Store Configuration", () => {
  it("should create store with expected properties", () => {
    const store = makeStore();

    expect(store).toHaveProperty("dispatch");
    expect(store).toHaveProperty("getState");
    expect(store).toHaveProperty("subscribe");

    // Validate persistReducer was used
    expect(persistReducer).toHaveBeenCalled();
  });

  it("should return initial state from root reducer", () => {
    const store = makeStore();
    const state = store.getState();

    // This depends on your root reducer's shape
    expect(state).toBeDefined();
  });
});
