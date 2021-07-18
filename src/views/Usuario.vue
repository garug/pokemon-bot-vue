<template>
  <section class="dex-cards">
    <article class="national">
      <h1>National Dex</h1>
      <p>{{ uniquePokemon.length }}/{{ length }}</p>
      <a @click="isMissingVisible = true" class="text-small">Missing pokemon</a>
    </article>
    <article>
      <h1>Total Catched</h1>
      <p>{{ (user.pokemon || []).length }} pokemon</p>
    </article>
  </section>
  <section>
    <div class="pokemon-filters">
      <input
        class="filter-search"
        placeholder="Search by species..."
        v-model="filters.search"
        type="text"
      />
      <fieldset class="filter-order">
        <p>Order by</p>
        <input
          type="radio"
          id="order-stats"
          value="stats"
          name="orderby"
          v-model="filters.orderBy"
        />
        <label for="order-stats">Stats</label>
        <input
          type="radio"
          id="order-number"
          value="number"
          name="orderby"
          v-model="filters.orderBy"
        />
        <label for="order-number">Number</label>
      </fieldset>
    </div>
    <table class="pokemon-table" v-if="user.pokemon">
      <thead>
        <tr class="text-small">
          <th>Nº</th>
          <th></th>
          <th>Species</th>
          <th>Total Stats</th>
          <th>ID</th>
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
          <span class="tag">#{{ pokemon.number }}</span>
        </td>
        <td>
          <img
            class="pokemon-img"
            :src="
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${pokemon.number}.png`
            "
          />
        </td>
        <td class="capitalize">{{ pokemon.name }}</td>
        <td class="text-small">{{ pokemon.total.toFixed(0) }}</td>
        <td>
          <span class="tag">{{ pokemon.id }}</span>
        </td>
      </tr>
    </table>

    <MainButton :disabled="filters.page == 1" @click="filters.page--">
      Prev
    </MainButton>
    <MainButton
      :disabled="filteredPokemon.length / 10 <= filters.page"
      @click="filters.page++"
    >
      Next
    </MainButton>
  </section>
  <div
    v-if="isMissingVisible"
    @click="isMissingVisible = false"
    class="modal-container"
  >
    <div class="modal" @click.stop="" style="width: 200px">
      <h1>Missing Pokemon</h1>
      <p @click="isMissingVisible = false" class="text-small modal-close">
        Close
      </p>
      <table class="pokemon-table" v-if="missingPokemon">
        <tr v-for="number in missingPokemon" :key="number">
          <td>
            <span class="tag">#{{ number }}</span>
          </td>
          <td>
            <img
              class="pokemon-img"
              :src="
                `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${number}.png`
              "
            />
          </td>
        </tr>
      </table>
    </div>
  </div>
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
  watch,
  reactive,
  watchEffect,
} from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import MainButton from "../components/Button.vue";

const Usuario = defineComponent({
  name: "Usuario",

  components: {
    MainButton,
  },

  setup() {
    const length = ref(151);
    const isMissingVisible = ref(false);
    const page = useRoute();
    const router = useRouter();
    const user = reactive({
      pokemon: [],
    });

    const filters = reactive({
      search: page.query.search || "",
      page: page.query.page || 1,
      orderBy: page.query.order || "number",
    });

    const isCatched = (name) => {
      return user.pokemon.some((p) => p.name === name);
    };

    const uniquePokemon = computed(() => {
      const arr = user.pokemon || [];
      return [...new Set(arr)];
    });

    const missingPokemon = computed(() =>
      Array.from({ length: length.value })
        .map((_, i) => i + 1)
        .filter((n) => !user.pokemon.some((p) => p.number === n))
    );

    const filteredPokemon = computed(() => {
      const arr = user.pokemon || [];
      return arr
        .filter((e) => e.name.includes(filters.search.toLowerCase()))
        .sort((a, b) => {
          switch (filters.orderBy) {
            case "stats":
              return b.total - a.total;
            case "number":
              return a.number - b.number;
          }
        });
    });

    watch(
      () => [filters.search, filters.orderBy],
      () => (filters.page = 1)
    );

    watchEffect(() => {
      router.push({
        query: { ...page.query, ...filters },
      });
    });

    onMounted(async () => {
      const [userReq] = await Promise.all([
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/users/${page.params.id}`),
      ]);

      user.pokemon = userReq.data.pokemon;
    });

    return {
      isCatched,
      uniquePokemon,
      length,
      user,
      filters,
      filteredPokemon,
      missingPokemon,
      isMissingVisible,
    };
  },
});

export default Usuario;
</script>

<style lang="scss" scoped>
.tag {
  align-items: center;
  background-color: #f5f5f5;
  border-radius: 0.375em;
  color: #4a4a4a;
  display: inline-flex;
  font-size: 0.75rem;
  height: 2em;
  line-height: 1.5;
  padding-left: 0.75em;
  padding-right: 0.75em;
  white-space: nowrap;
}

.text-small {
  font-size: 0.75rem;
}

.capitalize {
  text-transform: capitalize;
}

.pokemon-filters {
  background-color: #da0037;
  background-image: url("../assets/pattern.png");
  padding: 16px;
  margin-bottom: 16px;
}

.filter-search {
  width: 100%;
  max-width: 500px;
  padding: 8px 16px;
  margin-bottom: 8px;
  box-sizing: border-box;
  border: none;
  border-radius: 4px;
}

.filter-order {
  font-size: 0.75rem;
  font-weight: bold;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-order input[type="radio"] {
  display: none;
}

.filter-order input[type="radio"] + label {
  padding: 4px 8px;
  border: 1px solid white;
}

.filter-order input[type="radio"]:checked + label {
  background: white;
  color: #da0037;
}

.dex-cards {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  margin-bottom: 16px;
}

.dex-cards article {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #4a4a4a;
  border-radius: 8px;
  color: #e3e3e3;
  padding: 24px;
  flex-direction: column;
  gap: 8px;
}

.modal-container {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
}

.modal {
  width: 80%;
  max-width: 1024px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  color: #444;
  cursor: pointer;
}

.all-pokemon {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  max-width: 1920px;
  margin: 0 auto;
}

.pokemon-table {
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
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
