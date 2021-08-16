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
          :debounce="100"
          class="flex q-gutter-sm q-pa-sm"
        >
          <PokemonCard
            :pokemon="pokemon"
            v-for="pokemon in filteredPokemon"
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

<script>
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
import PokemonCard from "@/components/PokemonCard";
import PokemonDetailed from "@/components/PokemonDetailed.vue";

const Usuario = defineComponent({
  name: "Usuario",

  components: {
    PokemonCard,
    PokemonDetailed,
  },

  setup() {
    const allPokemon = ref([]);
    const length = ref(251);
    const infiniteScroll = ref(null);
    const user = reactive({
      pokemon: [],
    });
    const amount = ref(10);

    const filters = reactive({
      search: "",
    });

    const showingDetail = ref(false);
    const detailedPokemon = ref(undefined);

    function openDetail(pokemon) {
      detailedPokemon.value = pokemon;
      showingDetail.value = true;
    }

    const filteredPokemon = computed(() => {
      return [...(user.pokemon || [])]
        .filter((e) => e.name.includes(filters.search))
        .splice(0, amount.value);
    });

    watch(
      () => filters.search,
      () => {
        amount.value = 10;
        infiniteScroll.value.poll();
      }
    );

    onMounted(async () => {
      infiniteScroll.value.stop();
      const userReq = await axios.get(
        `${process.env.VUE_APP_BACKEND_URL}/users/`
      );

      user.pokemon = userReq.data.pokemon;
      infiniteScroll.value.resume();
    });

    function onScroll(index, done) {
      amount.value += 10;
      done();
    }

    return {
      state,
      length,
      infiniteScroll,
      user,
      allPokemon,
      filters,
      filteredPokemon,
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
