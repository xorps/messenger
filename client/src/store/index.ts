import { createStore, applyMiddleware, combineReducers } from "redux";
import loggerMiddleware from "redux-logger";
import thunkMiddleware from "redux-thunk";
import socketMiddleware from "../socket";
import {
  useDispatch as internal_useDispatch,
  useSelector as internal_useSelector,
  TypedUseSelectorHook,
} from "react-redux";

import user from "./user";
import conversations from "./conversations";
import activeConversation from "./activeConversation";

const CLEAR_ON_LOGOUT = "CLEAR_ON_LOGOUT";

export const clearOnLogout = () => {
  return {
    type: CLEAR_ON_LOGOUT,
  };
};

const appReducer = combineReducers({
  user,
  conversations,
  activeConversation,
});

// TODO: infer from createSlice/Actions/reducers..
export type ID = string | number;

type IsFetching = { isFetching: boolean };

type UserError = { error: any };

export type Message = { id: ID; text: string; senderId: ID; createdAt: string };

export type User = {
  id: ID;
  username: string;
  online: boolean;
  photoUrl: string;
};

export type Conversation = {
  id: ID;
  latestMessageText: string;
  notifications: number;
  messages: Message[];
  otherUser: User;
};

export function isUser(user: UserError | IsFetching | User): user is User {
  return "id" in user;
}

export function isUserError(
  user: UserError | IsFetching | User
): user is UserError {
  return "error" in user;
}

export function isFetching(
  user: UserError | IsFetching | User
): user is IsFetching {
  return "isFetching" in user;
}

// type RootState = ReturnType<typeof appReducer>;
// TODO: infer
type RootState = {} & {
  user: UserError | IsFetching | User;
  conversations?: Conversation[];
  activeConversation?: string;
};

export const useSelector: TypedUseSelectorHook<RootState> =
  internal_useSelector;

// TODO: add typing
const rootReducer = (state: any, action: any) => {
  if (action.type === CLEAR_ON_LOGOUT) {
    // set state to initial state
    state = undefined;
  }
  return appReducer(state, action);
};

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, loggerMiddleware, socketMiddleware)
);

type Dispatch = typeof store.dispatch;

export const useDispatch = () => internal_useDispatch<Dispatch>();

export default store;
