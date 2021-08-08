<template>
  <q-page-container>
    <section class="q-pa-md row items-center justify-center q-gutter-md">
      <q-card flat>
        <q-card-section class="bg-dark text-white">
          <div class="text-h6">{{ uniquePokemon.length }}/{{ length }}</div>
          <div class="text-subtitle2">National Dex</div>
        </q-card-section>
      </q-card>

      <q-card flat>
        <q-card-section class="bg-dark text-white">
          <div class="text-h6">{{ (user.pokemon || []).length }} pokemon</div>
          <div class="text-subtitle2">Total Catched</div>
        </q-card-section>
      </q-card>

      <q-btn
        class="bg-primary"
        @click="isMissingVisible = true"
        label="Missing Pokemon"
      />
    </section>

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
  <q-dialog v-model="isMissingVisible">
    <q-table title="Missing Pokemon" :rows="missingPokemon" flat row-key="name">
      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th>
            Nº
          </q-th>
          <q-th />
        </q-tr>
      </template>
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td class="text-center">
            <q-badge color="grey"> #{{ props.row }} </q-badge>
          </q-td>

          <q-td class="text-center">
            <q-img
              fit="none"
              :src="
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${props.row}.png`
              "
            />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-dialog>
</template>

<script>
import {
  computed,
  watch,
  defineComponent,
  onMounted,
  ref,
  reactive,
} from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import MainButton from "../components/Button.vue";
import Header from "../components/Header.vue";
import PokemonCard from "../components/PokemonCard.vue";
import { userStorage } from "@/storage";
import { iconSrc } from "@/utils/pokemon";
import { state } from "@/storage/state";

const Usuario = defineComponent({
  name: "Usuario",

  components: {
    Header,
    MainButton,
    PokemonCard,
  },

  setup() {
    const amount = ref(50);
    const infiniteScroll = ref(null);
    const filteredPokemon = computed(() => {
      return [...(user.pokemon || [])]
        .filter((e) => e.name.includes(filters.search))
        .splice(0, amount.value);
    });

    function onScroll(index, done) {
      amount.value += 30;
      done();
    }

    const length = ref(251);
    const isMissingVisible = ref(false);
    const page = useRoute();
    const user = reactive({
      info: userStorage.userInfo,
      pokemon: [],
    });

    const filters = reactive({
      search: "",
    });

    watch(
      () => filters.search,
      () => {
        amount.value = 50;
        infiniteScroll.value.poll();
      }
    );

    const uniquePokemon = computed(() => {
      const arr = user.pokemon || [];
      return [...new Set(arr.map((e) => e.number))];
    });

    const missingPokemon = computed(() =>
      Array.from({ length: length.value })
        .map((_, i) => i + 1)
        .filter((n) => !user.pokemon.some((p) => p.number === n))
    );

    onMounted(async () => {
      infiniteScroll.value.stop();
      const [userReq] = await Promise.all([
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/users/${page.params.id}`),
      ]);

      user.pokemon = userReq.data.pokemon;
      infiniteScroll.value.resume();
    });

    return {
      state,
      pagination: {
        sortBy: "stats",
        descending: true,
        page: 1,
        rowsPerPage: 10,
      },
      uniquePokemon,
      length,
      user,
      filters,
      missingPokemon,
      isMissingVisible,
      iconSrc,
      filteredPokemon,
      onScroll,
      infiniteScroll,
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
