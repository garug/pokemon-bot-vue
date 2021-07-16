<template>
  <section>
    <h1>All pokemon</h1>
    <input v-model="filters.search" type="text" />
    <table class="pokemon-table" v-if="user.pokemon">
      <thead>
        <tr>
          <th></th>
          <th>Species</th>
          <th>Total Stats</th>
          <th>ID</th>
          <th>Trainer</th>
        </tr>
      </thead>
      <tr
        v-for="pokemon in [...filteredPokemon].splice(
          (filters.page - 1) * 10,
          10
        )"
        :key="pokemon.id"
      >
        <td>
          <img
            class="pokemon-img"
            :src="
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${pokemon.number}.png`
            "
          />
        </td>
        <td>{{ pokemon.name }}</td>
        <td>{{ pokemon.total.toFixed(0) }}</td>
        <td>012345</td>
        <td>{{ pokemon.user }}</td>
      </tr>
    </table>

    <button :disabled="filters.page === 1" @click="filters.page--">Prev</button>
    <button
      :disabled="filteredPokemon.length / 10 <= filters.page"
      @click="filters.page++"
    >
      Next
    </button>
  </section>
  <!-- <section class="all-pokemon">
    <article
      v-for="pokemon in allPokemon"
      :key="pokemon.name"
      class="individual"
    >
      <img
        :src="
          `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.number}.png`
        "
        :alt="pokemon.pokemon.name"
        :class="isCatched(pokemon.pokemon.name) && 'catched'"
      />
      <h1>
        {{ isCatched(pokemon.pokemon.name) ? pokemon.pokemon.name : "?" }}
      </h1>
      <h2 class="number">#{{ `${pokemon.number}`.padStart(3, "0") }}</h2>
    </article>
  </section> -->
</template>

<script>
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  reactive,
  watch,
  watchEffect,
} from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const Usuario = defineComponent({
  name: "Usuario",

  setup() {
    const allPokemon = ref([]);
    const length = ref(151);
    const user = reactive({
      pokemon: [],
    });
    const filters = reactive({
      search: "",
      page: 1,
    });

    const isCatched = (name) => {
      return user.value.pokemon.some((p) => p.name === name);
    };

    const filteredPokemon = computed(() => {
      const arr = user.pokemon || [];
      return arr.filter((e) => e.name.includes(filters.search));
    });

    watch(
      () => filters.search,
      () => (filters.page = 1)
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

    return {
      isCatched,
      length,
      user,
      allPokemon,
      filters,
      filteredPokemon,
    };
  },
});

export default Usuario;
</script>

<style lang="scss" scoped>
.all-pokemon {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 1920px;
  margin: 0 auto;
}

.pokemon-table {
  width: 100%;
}

.pokemon-img {
  min-height: 56px;
}

@media (min-width: 1024px) {
  .all-pokemon {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1600px) {
  .all-pokemon {
    grid-template-columns: repeat(6, 1fr);
  }
}

.individual {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 8px;
  display: flex;
  position: relative;
  overflow: hidden;
}

.individual h1 {
  font-size: 24px;
}

.individual .number {
  font-size: 48px;
  bottom: 0;
  right: 5px;
  position: absolute;
  margin: 0;
  color: rgba(0, 0, 0, 0.05);
  font-weight: bolder;
}

.all-pokemon img {
  filter: grayscale(1);
  width: 50%;
  opacity: 0.5;
}

.all-pokemon .catched {
  filter: none;
  opacity: 1;
}
</style>
