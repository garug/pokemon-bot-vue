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

const Usuario = defineComponent({
  name: "Usuario",

  components: {
    PokemonCard,
  },

  setup() {
    const allPokemon = ref([]);
    const length = ref(151);
    const infiniteScroll = ref(null);
    const user = reactive({
      pokemon: [],
    });

    const amount = ref(50);

    const filters = reactive({
      search: "",
    });

    const filteredPokemon = computed(() => {
      return [...(user.pokemon || [])]
        .filter((e) => e.name.includes(filters.search))
        .splice(0, amount.value);
    });

    watch(
      () => filters.search,
      () => {
        amount.value = 50;
        infiniteScroll.value.poll();
      }
    );

    onMounted(async () => {
      const [userReq, allPkmnReq] = await Promise.all([
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/users/`),
        axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${length.value}`),
      ]);

      user.pokemon = userReq.data.pokemon;

      allPokemon.value = allPkmnReq.data.results.map((p, i) => {
        return {
          pokemon: p,
          number: i + 1,
          catched: userReq.data.pokemon.some((p2) => p2.name === p.name),
        };
      });
    });

    function onScroll(index, done) {
      amount.value += 30;
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
