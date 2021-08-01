<template>
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
        scroll-target="body"
        ref="infiniteScroll"
        @load="onScroll"
        :offset="160"
        :debounce="300"
        class="flex q-gutter-sm q-pa-sm"
      >
        <PokemonCard
          :pokemon="pokemon"
          v-for="pokemon in filteredPokemon"
          :key="pokemon.id"
        />
      </q-infinite-scroll>
    </div>
  </section>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUpdated,
  reactive,
  ref,
  watch,
} from "vue";

import PokemonCard from "@/components/PokemonCard.vue";
import { state } from "@/storage/state";

const PokemonBox = defineComponent({
  name: "PokemonBox",

  components: {
    PokemonCard,
  },

  props: {
    pokemonList: {
      type: Array as () => Array<any>,
      default: () => [],
    },
  },

  setup(props) {
    const amount = ref(10);
    const filters = reactive({
      search: "",
    });
    const infiniteScroll = ref(null as any);

    const filteredPokemon = computed(() => {
      return [...props.pokemonList]
        .filter((e) => e.name.includes(filters.search))
        .splice(0, amount.value);
    });

    function onScroll(_index: number, done: () => void) {
      amount.value += 10;
      done();
    }

    watch(
      () => filters.search,
      () => {
        amount.value = 10;
        infiniteScroll.value.poll();
      }
    );

    return {
      amount,
      filters,
      filteredPokemon,
      infiniteScroll,
      onScroll,
      state,
    };
  },
});

export default PokemonBox;
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
