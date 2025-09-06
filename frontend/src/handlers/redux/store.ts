/**
 * @description: contains all storage configurations.
 */
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers";
import { persistReducer } from "redux-persist";
import storage from "./storage";

const persistConfig = {
  key: "root",
  storage,
};

// making reducer a persistent reducer with storage.
const persistedReducer = persistReducer(persistConfig, rootReducer as any);

/**
 * @description: this function creates store and return configured store object.
 * @returns
 */
export const makeStore = () => {
  // configuring store with persistent reducer, devtools, and middleware which serialize and deserialize the store data.
  return configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
