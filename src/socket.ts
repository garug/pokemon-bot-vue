import io from "socket.io-client";

export function useSocket() {
  const socket = io(process.env.VUE_APP_BACKEND_URL);

  return socket;
}
