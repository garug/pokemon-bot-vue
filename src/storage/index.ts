import { UserStorage } from "./UserStorage";

let _userStorage: UserStorage;

export const userStorage = () => {
  if (!_userStorage) {
    _userStorage = new UserStorage();
  }
  return _userStorage;
};

export function getCookie(name: string) {
  return document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)")?.pop();
}
