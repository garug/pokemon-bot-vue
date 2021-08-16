<template>
  <q-header reveal @reveal="setVisibility" class="bg-pattern text-white">
    <q-toolbar class="content">
      <q-toolbar-title> </q-toolbar-title>
      <div class="q-gutter-md q-mr-xl">
        <router-link
          custom
          v-for="item in menuItems"
          :to="item.route()"
          :key="item.name"
          v-slot="{ navigate }"
        >
          <q-btn
            @click="navigate"
            v-if="item.visible()"
            flat
            round
            :icon="item.icon"
          />
        </router-link>
      </div>
      <q-btn
        v-if="!user"
        flat
        round
        icon="fab fa-discord"
        @click="openDiscordUrl"
      />
      <div v-else>
        <q-avatar>
          <img :src="userImg" />
          <q-menu transition-show="jump-down" transition-hide="jump-up">
            <div class="row no-wrap q-pa-md bg-black text-white">
              <div class="column items-center">
                <div class="text-subtitle1">
                  <p class="text-no-wrap">
                    {{ user.username }}
                    <span class="text-grey">#{{ user.discriminator }}</span>
                  </p>
                </div>

                <q-btn
                  size="sm"
                  unelevated
                  color="primary"
                  label="Logout"
                  @click="logout"
                  v-close-popup
                />
              </div>
            </div>
          </q-menu>
        </q-avatar>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { userStorage } from "@/storage";
import { state } from "@/storage/state";
import { defineComponent } from "vue";

const DefaultHeader = defineComponent({
  name: "DefaultHeader",

  methods: {
    openDiscordUrl() {
      document.cookie = `lastUrl=${this.$route.fullPath};path=/`;
      window.open(process.env.VUE_APP_DISCORD_REDIRECT_URL, "_self");
    },

    logout() {
      userStorage().revokeToken();
    },

    setVisibility(value: boolean) {
      state.headerVisible = value;
    },
  },

  data() {
    return {
      menuItems: [
        {
          name: "Home",
          icon: "fas fa-home",
          route: () => "/",
          visible: () => true,
        },
        {
          name: "Profile",
          icon: "fas fa-user",
          route: () => `/usuarios/${userStorage().userInfo.value?.id}`,
          visible: () => userStorage().userInfo.value?.id,
        },
        {
          name: "Market",
          icon: "fas fa-bullhorn",
          route: () => "/market",
          visible: () => true,
        },
      ],
      user: userStorage().userInfo,
    };
  },

  computed: {
    userImg() {
      const { id, avatar } = this.user as any;
      return `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
    },
  },
});

export default DefaultHeader;
</script>

<style lang="scss" scoped>
.text-discord {
  color: white;
}
.bg-discord {
  background: #7289da;
}
</style>
