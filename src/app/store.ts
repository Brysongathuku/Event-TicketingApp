import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// RTK Query APIs
import { userAPI } from "../features/users/usersApi";
import { LoginAPI } from "../features/login/LoginAPI";
import { eventApi } from "../features/events/eventAPI";
import { venuesApi } from "../features/Venue/VenueApi";
import UserSlice from "../features/users/Userslice";
import customerReducer from "../features/users/CustomerSlice";
import { bookingApi } from "../features/Bookings/bookingAPI";
import { supportTicketApi } from "../features/supportTickets/supportTicketApi";
// redux-persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["user"],
};

// Combine reducers
const rootReducer = combineReducers({
  [userAPI.reducerPath]: userAPI.reducer,

  [LoginAPI.reducerPath]: LoginAPI.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
  customers: customerReducer,
  [bookingApi.reducerPath]: bookingApi.reducer,
  [supportTicketApi.reducerPath]: supportTicketApi.reducer,
  [venuesApi.reducerPath]: venuesApi.reducer,
  user: UserSlice,
});

// Wrap in persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(userAPI.middleware)
      .concat(LoginAPI.middleware)
      .concat(eventApi.middleware)
      .concat(bookingApi.middleware)
      .concat(supportTicketApi.middleware)
      .concat(venuesApi.middleware),
});

// Persisted store
export const persistedStore = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
