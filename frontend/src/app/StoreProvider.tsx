/**
 * @description: This file contains store store-provided integration to the app. There will be only a single instance of the reduce store in the app.
 *               The store will be a persistent store. Wrapping this store in strict mode to avoid type confusion.
 */
"use client";
import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore } from "../handlers/redux/store";
import { initialStoreDefaultAction } from "../handlers/redux/actions";

import { PersistGate } from "redux-persist/integration/react";
import React from "react";
import { persistStore } from "redux-persist";

export default function StoreProvider({ children }: { children: React.ReactNode }) {

  const storeRef = useRef<AppStore>();
  
  let persistor: any;
  
  if (!storeRef.current) {
    
    // Create the store instance the first time this renders.
    storeRef.current = makeStore();
    
    // make this store persistent.
    persistor = persistStore(storeRef.current);

    // initializing the first/initial state.
    storeRef.current.dispatch(initialStoreDefaultAction());
    
  }

  return (
    <React.StrictMode>
      
      <Provider store={storeRef.current}>
        
        {/* Use persistGate if store creates issue with persistent storage. Uncommenting the below line should fix a possible persistent issue. */}
        {children}
      
      </Provider>
    
    </React.StrictMode>
  );
}
