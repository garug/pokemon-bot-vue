<template>
  <PokemonBox :pokemonList="offers" />
</template>

<script lang="ts">
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";

import PokemonBox from "@/components/PokemonBox.vue";

const MarketAvailable = defineComponent({
  name: "MarketAvailable",

  components: {
    PokemonBox,
  },

  setup() {
    const offers = ref([]);

    onMounted(async () => {
      const userReq = await axios.get(
        `${process.env.VUE_APP_BACKEND_URL}/pokemon/tradable`
      );

      offers.value = userReq.data;
    });

    return { offers };
  },
});

export default MarketAvailable;
</script>
