import { ref, watchEffect, readonly } from "vue";
import axios from "axios";
import { state } from "./state";

interface Token {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

interface UserInfo {
  accent_color: null;
  avatar: string;
  banner: null;
  banner_color: null;
  discriminator: string;
  flags: number;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  public_flags: number;
  username: string;
}

export class UserStorage {
  private token = ref<Token | undefined>(undefined);

  private _userInfo = ref<UserInfo | undefined>(undefined);

  userInfo = readonly(this._userInfo);

  constructor() {
    watchEffect(() => {
      if (this.token.value) {
        const { refresh_token } = this.token.value;
        document.cookie = `refresh=${refresh_token};path=/`;
      }
    });
  }

  setToken(token: Token) {
    state.logged = true;
    this.token.value = token;
  }

  setUserInfo(userInfo?: UserInfo) {
    this._userInfo.value = userInfo;
  }

  getHeaders() {
    if (!this.token.value) {
      return {};
    }

    const { token_type, access_token } = this.token.value;

    return {
      Authorization: `${token_type} ${access_token}`,
    };
  }

  async revokeToken() {
    await axios.post(`${process.env.VUE_APP_BACKEND_URL}/logout`, {
      token: this.token.value?.access_token,
    });
    document.cookie = `refresh=;path=/`;
    state.logged = false;
    this.setUserInfo(undefined);
  }
}
