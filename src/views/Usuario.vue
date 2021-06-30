<template>
  <p>This user have catched {{ (user.pokemon || []).length }} pokemon</p>
  <p>Currently dex: {{ uniquePokemon.length }}/{{ length }}</p>
  <section class="all-pokemon">
    <article
      v-for="pokemon in allPokemon"
      :key="pokemon.name"
      class="individual"
    >
      <img
        :src="`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.number}.png`"
        :alt="pokemon.pokemon.name"
        :class="isCatched(pokemon.pokemon.name) && 'catched'"
      />
      <h1>
        {{ isCatched(pokemon.pokemon.name) ? pokemon.pokemon.name : "?" }}
      </h1>
      <h2 class="number">#{{ `${pokemon.number}`.padStart(3, "0") }}</h2>
    </article>
  </section>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const Usuario = defineComponent({
  name: "Usuario",

  setup() {
    const allPokemon = ref([]);
    const length = ref(151);
    const page = useRoute();
    const user = ref({});

    const isCatched = (name) => {
      return user.value.pokemon.some((p) => p.name === name);
    };

    const uniquePokemon = computed(() => {
      const arr = user.value.pokemon || [];
      return [...new Set(arr.map((e) => e.name))];
    });

    onMounted(async () => {
      const [userReq, allPkmnReq] = await Promise.all([
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/users/${page.params.id}`),
        axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=${length.value}`),
      ]);

      user.value = userReq.data;

      allPokemon.value = allPkmnReq.data.results.map((p, i) => {
        return {
          pokemon: p,
          number: i + 1,
          catched: userReq.data.pokemon.some((p2) => p2.name === p.name),
        };
      });
    });

    return { isCatched, uniquePokemon, length, user, allPokemon };
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
