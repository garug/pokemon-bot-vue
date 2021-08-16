<template>
  <div class="pokemon-card" :class="{ 'no-hover': disableHover }">
    <div class="col-auto">
      <h1>{{ pokemon.name }}</h1>
      <p class="q-ma-none">{{ pokemon.total.toFixed(0) }}</p>
    </div>
    <q-img
      class="col-auto"
      width="68px"
      height="56px"
      fit="none"
      spinner-size="16px"
      :src="iconSrc(pokemon.number)"
    />
    <q-badge class="pokemon-badge">
      {{ pokemon.id }}
    </q-badge>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import axios from "axios";

import { iconSrc, fullArt } from "@/utils/pokemon";
import { userStorage } from "@/storage";

const PokemonCard = defineComponent({
  name: "PokemonCard",

  props: {
    pokemon: {
      required: true,
    },
    disableHover: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      creatingOffer: false,
    };
  },

  methods: {
    iconSrc,
    fullArt,
    async toggleTradable() {
      const pokemon: any = this.$props.pokemon;
      const request = await axios.patch(
        `${process.env.VUE_APP_BACKEND_URL}/pokemon/${pokemon.id}/marks/tradable`
      );
      pokemon.marks.tradable = request.data;
    },
  },

  computed: {
    sameUser() {
      const pokemon: any = this.$props.pokemon;
      return userStorage().userInfo.value?.id === pokemon.user;
    },
  },
});

export default PokemonCard;
</script>

<style lang="scss" scoped>
h1 {
  @include header-font;
}

.pokemon-card {
  background: $dark-2;
  width: 200px;
  height: 68px;
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  transition: all linear 0.1s;
  transition: all linear 0.1s 0.1s;
  transform: translateY(0);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0);
}

.pokemon-card:hover:not(.no-hover) {
  cursor: pointer;
  transform: translateY(-4px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.8);
  transition: all linear 0.1s;
}

.pokemon-card h1 {
  @include header-font;
  font-size: 14px;
  line-height: initial;
  color: $text-white;
}

.pokemon-card p {
  font-size: 14px;
  font-weight: bold;
  color: $text-dark;
}

.pokemon-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 9px;
  color: #fff;
  background-color: #000;
  opacity: 0.1;
}
</style>
