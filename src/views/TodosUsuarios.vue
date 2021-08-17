<template>
  <q-page-container>
    <section style="display: flex">
      <div class="sidebar-container">
        <div
          class="sidebar q-pa-sm"
          :style="{ top: state.headerVisible ? '50px' : 0 }"
        >
          <q-input
            dense
            color="primary"
            v-model="filters.search"
            placeholder="Search by species..."
          >
            <template v-slot:append>
              <q-icon name="fas fa-search" />
            </template>
          </q-input>
        </div>
      </div>
      <div style="max-width: calc(100vw - 300px)">
        <q-infinite-scroll
          ref="infiniteScroll"
          @load="onScroll"
          :offset="160"
          class="flex q-gutter-sm q-pa-sm"
        >
          <PokemonCard
            :pokemon="pokemon"
            v-for="pokemon in allPokemon"
            :key="pokemon.id"
            @click="openDetail(pokemon)"
          />
        </q-infinite-scroll>
      </div>
      <q-dialog
        v-model="showingDetail"
        transition-show="jump-up"
        transition-hide="jump-down"
      >
        <PokemonDetailed
          style="width: 600px; max-width: 80vw;"
          :pokemon="detailedPokemon"
        />
      </q-dialog>
    </section>
  </q-page-container>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  reactive,
  watch,
} from "vue";
import axios from "axios";
import { iconSrc } from "@/utils/pokemon";
import { state } from "@/storage/state";
import PokemonCard from "@/components/PokemonCard.vue";
import PokemonDetailed from "@/components/PokemonDetailed.vue";
import { getPokemon } from "@/services/pokemon";
import { debounce, throttle } from "lodash";

const Usuario = defineComponent({
  name: "Usuario",

  components: {
    PokemonCard,
    PokemonDetailed,
  },

  setup() {
    const allPokemon = ref<any[]>([]);
    const length = ref(251);
    const infiniteScroll = ref<any | undefined>(undefined);

    const filters = reactive({
      search: "",
    });

    const showingDetail = ref(false);
    const detailedPokemon = ref(undefined);

    function openDetail(pokemon: any) {
      detailedPokemon.value = pokemon;
      showingDetail.value = true;
    }

    function resetData() {
      allPokemon.value = [];
      infiniteScroll.value.reset();
      infiniteScroll.value.resume();
    }

    async function loadData(page: number) {
      const pokemonReq = await getPokemon({ page, name: filters.search });
      allPokemon.value.push(...pokemonReq.data);

      return pokemonReq.data;
    }

    watch(() => filters.search, throttle(resetData, 250));

    function onScroll(index: any, done: (stop: boolean) => {}) {
      loadData(index).then((loadedData) => {
        done(loadedData.length === 0);
      });
    }

    return {
      state,
      length,
      infiniteScroll,
      allPokemon,
      filters,
      iconSrc,
      onScroll,
      showingDetail,
      openDetail,
      detailedPokemon,
    };
  },
});

export default Usuario;
</script>

<style lang="scss" scoped>
.sidebar-container {
  width: 300px;
}

.sidebar {
  transition: all ease 0.1s;
  position: sticky;
  width: 100%;
}
</style>
