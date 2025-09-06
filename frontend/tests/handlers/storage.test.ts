import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// We will reload the storage module after altering window
const loadStorageModule = () => {
  jest.resetModules();
  return require("./storage").default;
};

jest.mock("redux-persist/lib/storage/createWebStorage", () =>
  jest.fn(() => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
  }))
);

describe("storage.ts", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should use localStorage when window is defined", () => {
    (global as any).window = {}; // simulate browser
    const storage = loadStorageModule();

    expect(createWebStorage).toHaveBeenCalledWith("local");
    expect(storage).toHaveProperty("getItem");
    expect(storage).toHaveProperty("setItem");
  });

  it("should use noop storage when window is undefined", () => {
    delete (global as any).window; // simulate SSR
    const storage = loadStorageModule();

    expect(createWebStorage).not.toHaveBeenCalled();
    expect(storage.getItem).toBeInstanceOf(Function);

    // Check noop behavior
    return expect(storage.getItem("key")).resolves.toBeNull();
  });
});
