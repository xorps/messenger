import io from "socket.io-client";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import { GET_USER, GO_OFFLINE, SEND_MESSAGE } from "./store/user";

export default function middleware(store) {
  // https://socket.io/docs/v3/middlewares/#Sending-credentials
  const socket = io(window.location.origin, {
    autoConnect: false,
    auth: cb => cb({token: localStorage.getItem('messenger-token')}),
  });

  socket.on("connect", () => {
    socket.emit("go-online");

    socket.on("add-online-user", (id) => {
      store.dispatch(addOnlineUser(id));
    });

    socket.on("remove-offline-user", (id) => {
      store.dispatch(removeOfflineUser(id));
    });
    socket.on("new-message", (data) => {
      store.dispatch(setNewMessage(data.message, data.sender));
    });
  });

  return next => action => {
    if (action.type === GET_USER && action.user && action.user.id) {
      socket.connect();
    } else if (action.type === GO_OFFLINE) {
      socket.emit("logout");
      socket.disconnect();
    } else if (action.type === SEND_MESSAGE) {
      socket.emit("new-message", action.payload);
    }
    return next(action);
  };
}
