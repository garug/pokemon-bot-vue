<template>
  <div
    v-ripple
    @click="detailed = true"
    class="pokemon-card"
    :class="{ detailed }"
  >
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

  <q-dialog v-model="detailed">
    <q-card class="pokemon-dialog"> </q-card>
  </q-dialog>

  <q-dialog v-model="detailed">
    <q-card style="width: 600; max-width: 80vw;">
      <q-card-section class="pokemon-dialog">
        <div class="col-auto flex column items-center">
          <h1 class="pokemon-name">{{ pokemon.name }}</h1>
          <div class="col-auto">
            <q-img
              width="200px"
              fit="contain"
              class="pokemon-fullart"
              :src="fullArt(pokemon.number)"
              :alt="pokemon.name"
            />
          </div>
        </div>
        <article class="col-auto flex column justify-center q-px-md">
          <h1>Stats</h1>
          <ul>
            <li>HP: {{ pokemon.attributes.hp.toFixed(0) }}</li>
            <li>Attack: {{ pokemon.attributes.attack.toFixed(0) }}</li>
            <li>Defense: {{ pokemon.attributes.defense.toFixed(0) }}</li>
            <li>Sp. Attack: {{ pokemon.attributes.sp_attack.toFixed(0) }}</li>
            <li>Sp. Defense: {{ pokemon.attributes.sp_defense.toFixed(0) }}</li>
            <li>Speed: {{ pokemon.attributes.speed.toFixed(0) }}</li>
          </ul>
        </article>
        <div class="col-auto flex column justify-center q-px-md">
          <article>
            <h1>Caught in</h1>
            {{ pokemon.created_at }}
          </article>
          <article>
            <h1>Original User</h1>
            {{ pokemon.original_user }}
          </article>
        </div>
        <q-badge class="pokemon-badge">
          {{ pokemon.id }}
        </q-badge>
      </q-card-section>

      <template v-if="sameUser">
        <q-separator />

        <q-card-actions align="right">
          <q-toggle
            size="xs"
            :model-value="(pokemon.marks && pokemon.marks.tradable) || false"
            @update:model-value="toggleTradable"
            color="primary"
            label="Tradable"
          />
        </q-card-actions>
      </template>
    </q-card>
  </q-dialog>
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
  },

  data() {
    return {
      type: Object,
      detailed: false,
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
      return userStorage.userInfo.value?.id === pokemon.user;
    },
  },
});

export default PokemonCard;
</script>

<style lang="scss" scoped>
h1 {
  @include header-font;
}

article {
  margin-bottom: 8px;
}

article h1 {
  color: $text-dark;
  font-weight: bold;
  font-size: 12px;
  margin: 0;
  line-height: normal;
}

.pokemon-card {
  background: $dark-2;
  cursor: pointer;
  width: 200px;
  height: 68px;
  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  position: relative;
  transition: all linear 0.1s;
  transition: all linear 0.1s 0.1s;
  transform: translateY(0);
  box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
}

.pokemon-card:hover,
.pokemon-card.detailed {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
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
  opacity: 10%;
}

.pokemon-dialog .pokemon-badge {
  font-size: 12px;
  opacity: 20%;
}

.pokemon-dialog {
  display: flex;
  font-size: 13px;
}

.pokemon-fullart {
  width: 50%;
}

.pokemon-name {
  font-size: 24px;
  line-height: normal;
}
</style>
