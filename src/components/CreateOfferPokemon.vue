<template>
  <q-card style="width: 600px; max-width: 80vw;">
    <q-card-section class="pokemon-make-offer">
      <div>
        <q-input
          v-model="filters.search"
          dense
          color="primary"
          placeholder="Search by species..."
        >
          <template v-slot:append>
            <q-icon name="fas fa-search" />
          </template>
        </q-input>
        <div class="options-container">
          <PokemonCard
            @click="sendingPokemon = p"
            :pokemon="p"
            v-for="p in availablePokemon"
            :key="p.id"
          />
        </div>
      </div>
      <div>
        <div class="pokemon-offer-container">
          <PokemonCard :pokemon="pokemon" />
          <i class="pokemon-retrieving fas fa-level-down-alt"></i>
        </div>
        <div class="pokemon-offer-container">
          <i class="icon pokemon-sending fas fa-level-up-alt"></i>
          <PokemonCard v-if="sendingPokemon" :pokemon="sendingPokemon" />
          <p v-else>Choose a pokémon to send</p>
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-actions align="right">
      <q-btn
        :disabled="!sendingPokemon"
        @click="confirmOffer"
        color="primary"
        label="Confirm Offer"
      />
    </q-card-actions>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, watch } from "vue";

import PokemonCard from "@/components/PokemonCard.vue";

import { getPokemon } from "@/services/pokemon";
import { createOffer } from "@/services/offers";
import { userStorage } from "@/storage";
import { debounce, useQuasar } from "quasar";

const CreateOfferPokemon = defineComponent({
  name: "CreateOfferPokemon",

  components: {
    PokemonCard,
  },

  props: {
    pokemon: {
      type: Object,
      required: true,
    },
  },

  setup(props, { emit }) {
    const $q = useQuasar();
    const filters = reactive({
      search: "",
    });

    const availablePokemon = ref([]);

    const sendingPokemon = ref<any>(undefined);

    async function loadData() {
      const sentFilters = {
        name: filters.search,
        limit: 6,
        user: userStorage().userInfo.value?.id,
      };
      const request = await getPokemon(sentFilters);
      availablePokemon.value = request.data.pokemon;
    }

    async function confirmOffer() {
      const offer = await createOffer({
        offeror: {
          id: sendingPokemon.value?.user,
          pokemon_id: sendingPokemon.value?.id,
        },
        owner: {
          id: props.pokemon.user,
          pokemon_id: props.pokemon.id,
        },
      });
      $q.notify({
        type: "positive",
        position: "top-right",
        message: "Offer created",
      });
      emit("created", offer);
    }

    watch(() => filters.search, debounce(loadData, 250));

    onMounted(() => loadData());

    return { filters, sendingPokemon, confirmOffer, availablePokemon };
  },
});

export default CreateOfferPokemon;
</script>

<style lang="scss" scoped>
.pokemon-make-offer {
  display: flex;
  font-size: 13px;
  align-items: center;

  div {
    flex-grow: 1;
  }
}

.options-container {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  width: 100%;
}

.pokemon-retrieving,
.pokemon-sending {
  font-size: 1.8em;
  flex-grow: 1;
}

.pokemon-retrieving {
  color: #b53333;
}

.pokemon-sending {
  color: #33b540;
}

.icon {
  transform: scale(-1, 1);
}

.pokemon-offer-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  gap: 8px;
}
</style>
