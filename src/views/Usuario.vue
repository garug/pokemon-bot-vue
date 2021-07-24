<template>
  <q-page>
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
        class="bg-white"
        @click="isMissingVisible = true"
        label="Missing Pokemon"
      />
    </section>

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
        class="col-6 self-center"
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

    <q-dialog v-model="isMissingVisible">
      <q-table
        title="Missing Pokemon"
        :rows="missingPokemon"
        flat
        row-key="name"
      >
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
  </q-page>
</template>

<script>
import { computed, defineComponent, onMounted, ref, reactive } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";
import MainButton from "../components/Button.vue";
import Header from "../components/Header.vue";
import { userStorage } from "@/storage";

const Usuario = defineComponent({
  name: "Usuario",

  components: {
    Header,
    MainButton,
  },

  setup() {
    const length = ref(151);
    const isMissingVisible = ref(false);
    const page = useRoute();
    const user = reactive({
      info: userStorage.userInfo,
      pokemon: [],
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
    ];

    const filters = reactive({
      search: "",
    });

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
      const [userReq] = await Promise.all([
        axios.get(`${process.env.VUE_APP_BACKEND_URL}/users/${page.params.id}`),
      ]);

      user.pokemon = userReq.data.pokemon;
    });

    return {
      pagination: {
        sortBy: "stats",
        descending: true,
        page: 1,
        rowsPerPage: 10,
      },
      columns,
      uniquePokemon,
      length,
      user,
      filters,
      missingPokemon,
      isMissingVisible,
    };
  },
});

export default Usuario;
</script>
