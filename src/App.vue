<template>
  <q-layout class="bg-grey-2">
    <DefaultHeader />
    <q-page-container class="content">
      <router-view />
    </q-page-container>
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
.content {
  max-width: 1920px;
  margin: 0 auto;
}

.bg-pattern {
  background-image: url("./assets/pattern.png") !important;
}
</style>
