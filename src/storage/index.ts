import { UserStorage } from "./UserStorage";

export const userStorage = new UserStorage();

export function getCookie(name: string) {
  return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop();
}
