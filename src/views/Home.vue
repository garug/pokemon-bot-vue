<template>
  <div class="home">
    <img
      alt="Vue logo"
      :src="`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`"
    />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <a
      href="https://discord.com/api/oauth2/authorize?client_id=855825211826896906&redirect_uri=http%3A%2F%2Flocalhost%3A8080&response_type=code&scope=identify"
      >Login</a
    >
    {{ user }}
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import { useRoute } from "vue-router";
import axios from "axios";
import qs from "qs";

export default defineComponent({
  name: "Home",
  components: {
    HelloWorld,
  },

  setup() {
    const route = useRoute();

    const user = reactive({
      id: "",
      avatar: "",
      discriminator: "",
      username: "",
    });

    const { code } = route.query;

    const obj = {
      client_id: "855825211826896906",
      client_secret: "UePrbti0Rr_sDJIqDghfFwd14CjU5uGo",
      code,
      grant_type: "authorization_code",
      redirect_uri: `http://localhost:8080`,
      scope: "identify",
    };

    if (code) {
      axios.post(`${process.env.VUE_APP_BACKEND_URL}/login`, obj).then((r) =>
        axios
          .post(`${process.env.VUE_APP_BACKEND_URL}/@me`, r.data)
          .then((r2) => {
            user.id = r2.data.id;
            user.avatar = r2.data.avatar;
            user.discriminator = r2.data.discriminator;
            user.username = r2.data.discriminator;
          })
      );
    }

    return { user };
  },
});
</script>
