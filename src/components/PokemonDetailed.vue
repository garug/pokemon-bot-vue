<template>
  <q-card>
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

    <template v-if="logged">
      <q-separator />
      <q-card-actions align="right">
        <template v-if="sameUser">
          <q-toggle
            size="xs"
            :model-value="(pokemon.marks && pokemon.marks.tradable) || false"
            @update:model-value="toggleTradable"
            color="primary"
            label="Tradable"
          />
        </template>
        <template v-else>
          <q-btn
            color="primary"
            @click="creatingOffer = true"
            label="Make a Offer"
          />
        </template>
      </q-card-actions>
    </template>
    <q-dialog
      transition-show="jump-up"
      transition-hide="jump-down"
      v-model="creatingOffer"
    >
      <CreateOfferPokemon
        :pokemon="pokemon"
        style="width: 750px"
        @created="creatingOffer = false"
      />
    </q-dialog>
  </q-card>
</template>

<script lang="ts">
import axios from "axios";
import { computed, defineComponent, ref } from "vue";

import { fullArt } from "@/utils/pokemon";
import { userStorage } from "@/storage";
import CreateOfferPokemon from "@/components/CreateOfferPokemon.vue";
import { state } from "@/storage/state";

const PokemonDetailed = defineComponent({
  name: "PokemonDetailed",

  components: {
    CreateOfferPokemon,
  },

  props: {
    pokemon: {
      required: true,
    },
  },

  setup(props) {
    const creatingOffer = ref(false);
    const sameUser = computed(() => {
      const pokemon: any = props.pokemon;
      return userStorage().userInfo.value?.id === pokemon.user;
    });

    async function toggleTradable() {
      const pokemon: any = props.pokemon;
      const request = await axios.patch(
        `${process.env.VUE_APP_BACKEND_URL}/pokemon/${pokemon.id}/marks/tradable`
      );
      pokemon.marks.tradable = request.data;
    }

    return {
      logged: state.logged,
      sameUser,
      creatingOffer,
      fullArt,
      toggleTradable,
    };
  },
});

export default PokemonDetailed;
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

.pokemon-dialog .pokemon-badge {
  font-size: 12px;
  opacity: 0.2;
}

.pokemon-dialog {
  display: flex;
  font-size: 13px;
}

.pokemon-name {
  font-size: 24px;
  line-height: normal;
}

.pokemon-fullart {
  width: 50%;
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
