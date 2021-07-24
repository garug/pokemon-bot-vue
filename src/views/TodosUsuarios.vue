<template>
  <section>
    <q-table
      :rows="user.pokemon || []"
      :columns="columns"
      flat
      row-key="id"
      :filter="filters.search"
      :pagination="pagination"
    >
      <template v-slot:top>
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
      </template>
      <template v-slot:body-cell-picture="props">
        <q-td style="min-width: 100px" :props="props">
          <q-img
            height="56px"
            fit="none"
            :src="
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${props.row.number}.png`
            "
          />
        </q-td>
      </template>

      <template v-slot:body-cell-id="props">
        <q-td :props="props">
          <q-badge color="grey">
            {{ props.row.id }}
          </q-badge>
        </q-td>
      </template>

      <template v-slot:body-cell-number="props">
        <q-td :props="props">
          <q-badge color="grey"> #{{ props.row.number }} </q-badge>
        </q-td>
      </template>
    </q-table>
  </section>
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

    const columns = [
      {
        name: "number",
        required: true,
        label: "Nº",
        align: "center",
        field: (row) => row.number,
        sortable: true,
      },
      {
        name: "picture",
        required: true,
        align: "center",
      },
      {
        name: "species",
        field: "name",
        label: "Species",
      },
      {
        name: "stats",
        label: "Total Stats",
        field: (row) => row.total.toFixed(0),
        sortable: true,
      },
      {
        name: "id",
        label: "ID",
      },
      { name: "user", field: "user", label: "idUser" },
    ];

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
      columns,
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
