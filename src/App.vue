<template>
  <q-layout class="bg-main">
    <DefaultHeader />
    <router-view />
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getCookie, userStorage } from "./storage";
import axios from "axios";

import DefaultHeader from "./components/Header.vue";

export default defineComponent({
  name: "App",

  components: {
    DefaultHeader,
  },

  async beforeMount() {
    const refresh_token = getCookie("refresh");

    if (!refresh_token) return;

    const token = await axios.post(
      `${process.env.VUE_APP_BACKEND_URL}/refresh`,
      {
        refresh_token,
      }
    );
    const userInfo = await axios.post(
      `${process.env.VUE_APP_BACKEND_URL}/@me`,
      token.data
    );
    userStorage.setToken(token.data);
    userStorage.setUserInfo(userInfo.data);
  },
});
</script>

<style lang="scss">
.bg-pattern {
  background-image: url("./assets/pattern.png") !important;
}

.bg-main {
  background: $dark-1;
}
</style>
