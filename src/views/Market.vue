<template>
  <q-page-container>
    <q-page>
      <q-tabs
        class="text-grey"
        active-color="white"
        indicator-color="primary"
      >
        <q-route-tab label="Available" to="/market/available" />
        <q-route-tab label="Offers" to="/market/offers" />
      </q-tabs>
      <router-view />
    </q-page>
  </q-page-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import axios from "axios";

const MarketPage = defineComponent({
  name: "MarketPage",


});

export default MarketPage;
</script>
