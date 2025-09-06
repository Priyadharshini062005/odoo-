/**
 * @description: This file contains persistent storage code. To save data, web storage is used with Noop storage.
 *               The store data will be stored at local storage in the browser.
 */
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/**
 *
 * @returns a promise which serialize data before storage or deserialize before retrieval.
 */
const createNoopStorage = () => {
  return {
    // eslint-disable-next-line
    getItem(_key: any) {
      return Promise.resolve(null);
    },
    // eslint-disable-next-line
    setItem(_key: any, value: any) {
      return Promise.resolve(value);
    },
    // eslint-disable-next-line
    removeItem(_key: any) {
      return Promise.resolve();
    },
  };
};

// Check if local storage is available, use it otherwise create noop storage.
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

export default storage;
