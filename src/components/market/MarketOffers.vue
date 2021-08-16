<template>
  <section class="container">
    <article
      class="offer"
      v-for="offer in myOffers"
      :key="offer.id"
      @click="openOffer(offer)"
    >
      <div class="pokemon-offer-container">
        <PokemonCard disableHover :pokemon="offer.sentPokemon" />
        <i class="pokemon-retrieving fas fa-level-down-alt"></i>
      </div>
      <div class="pokemon-offer-container">
        <i class="icon pokemon-sending fas fa-level-up-alt"></i>
        <PokemonCard disableHover :pokemon="offer.retrievedPokemon" />
      </div>
    </article>
    <q-dialog
      v-model="showingOffer"
      transition-show="jump-up"
      transition-hide="jump-down"
    >
      <q-card>
        <q-card-section class="pokemon-dialog">
          <div>
            <div class="col-auto flex column items-center">
              <p>sending</p>
              <h1 class="pokemon-name">{{ detailedOffer.sentPokemon.name }}</h1>
              <div class="col-auto">
                <q-img
                  width="200px"
                  fit="contain"
                  class="pokemon-fullart"
                  :src="fullArt(detailedOffer.sentPokemon.number)"
                  :alt="detailedOffer.sentPokemon.name"
                />
              </div>
            </div>
            <article class="col-auto flex column justify-center q-px-md">
              <h1>Stats</h1>
              <ul>
                <li>
                  HP: {{ detailedOffer.sentPokemon.attributes.hp.toFixed(0) }}
                </li>
                <li>
                  Attack:
                  {{ detailedOffer.sentPokemon.attributes.attack.toFixed(0) }}
                </li>
                <li>
                  Defense:
                  {{ detailedOffer.sentPokemon.attributes.defense.toFixed(0) }}
                </li>
                <li>
                  Sp. Attack:
                  {{
                    detailedOffer.sentPokemon.attributes.sp_attack.toFixed(0)
                  }}
                </li>
                <li>
                  Sp. Defense:
                  {{
                    detailedOffer.sentPokemon.attributes.sp_defense.toFixed(0)
                  }}
                </li>
                <li>
                  Speed:
                  {{ detailedOffer.sentPokemon.attributes.speed.toFixed(0) }}
                </li>
              </ul>
            </article>
            <div class="col-auto flex column justify-center q-px-md">
              <article>
                <h1>Caught in</h1>
                {{ detailedOffer.sentPokemon.created_at }}
              </article>
              <article>
                <h1>Original User</h1>
                {{ detailedOffer.sentPokemon.original_user }}
              </article>
            </div>
          </div>
          <div>
            <div class="col-auto flex column items-center">
              <p>receiving</p>
              <h1 class="pokemon-name">
                {{ detailedOffer.retrievedPokemon.name }}
              </h1>
              <div class="col-auto">
                <q-img
                  width="200px"
                  fit="contain"
                  class="pokemon-fullart"
                  :src="fullArt(detailedOffer.retrievedPokemon.number)"
                  :alt="detailedOffer.retrievedPokemon.name"
                />
              </div>
            </div>
            <article class="col-auto flex column justify-center q-px-md">
              <h1>Stats</h1>
              <ul>
                <li>
                  HP:
                  {{ detailedOffer.retrievedPokemon.attributes.hp.toFixed(0) }}
                </li>
                <li>
                  Attack:
                  {{
                    detailedOffer.retrievedPokemon.attributes.attack.toFixed(0)
                  }}
                </li>
                <li>
                  Defense:
                  {{
                    detailedOffer.retrievedPokemon.attributes.defense.toFixed(0)
                  }}
                </li>
                <li>
                  Sp. Attack:
                  {{
                    detailedOffer.retrievedPokemon.attributes.sp_attack.toFixed(
                      0
                    )
                  }}
                </li>
                <li>
                  Sp. Defense:
                  {{
                    detailedOffer.retrievedPokemon.attributes.sp_defense.toFixed(
                      0
                    )
                  }}
                </li>
                <li>
                  Speed:
                  {{
                    detailedOffer.retrievedPokemon.attributes.speed.toFixed(0)
                  }}
                </li>
              </ul>
            </article>
            <div class="col-auto flex column justify-center q-px-md">
              <article>
                <h1>Caught in</h1>
                {{ detailedOffer.retrievedPokemon.created_at }}
              </article>
              <article>
                <h1>Original User</h1>
                {{ detailedOffer.retrievedPokemon.original_user }}
              </article>
            </div>
          </div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="right">
          <q-btn
            color="green"
            @click="approvalStatus(true)"
            icon="fas fa-check"
            label="Accept"
          />
          <q-btn
            color="red"
            @click="approvalStatus(false)"
            icon="fas fa-times"
            label="Reject"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { partition } from "lodash";

import PokemonCard from "@/components/PokemonCard.vue";
import { createApprovalStatus, getOffers } from "@/services/offers";
import { userStorage } from "@/storage";
import { fullArt } from "@/utils/pokemon";
import { useQuasar } from "quasar";

const MarketOffers = defineComponent({
  name: "MarketOffers",

  components: {
    PokemonCard,
  },

  setup() {
    const $q = useQuasar();
    const myOffers = ref<any>([]);
    const showingOffer = ref(false);
    const detailedOffer = ref<any | undefined>(undefined);

    async function loadOffers() {
      const id = userStorage().userInfo.value?.id;
      if (!id) return;
      const req = await getOffers(id);
      const [offers] = partition(req.data, {
        offeror: id,
      });
      myOffers.value = offers;
    }

    async function approvalStatus(status: boolean) {
      const approval = await createApprovalStatus(
        detailedOffer.value.id,
        status
      );

      await loadOffers();

      if (status) {
        $q.notify({
          type: "positive",
          message: `Offer accepted, take care of ${detailedOffer.value.retrievedPokemon.name} ❤️`,
          position: "top-right",
        });
      } else {
        $q.notify({
          type: "info",
          message: "Offer rejected",
          position: "top-right",
        });
      }

      showingOffer.value = false;
      detailedOffer.value = undefined;
    }

    function openOffer(offer: any) {
      showingOffer.value = true;
      detailedOffer.value = offer;
    }

    watch(() => userStorage().userInfo.value, loadOffers);

    onMounted(async () => {
      loadOffers();
    });

    return {
      myOffers,
      fullArt,
      openOffer,
      showingOffer,
      detailedOffer,
      approvalStatus,
    };
  },
});

export default MarketOffers;
</script>

<style lang="scss" scoped>
h1 {
  @include header-font;
}

article {
  margin-bottom: 8px;
}

article h1 {
  color: $text-dark;
  font-weight: bold;
  font-size: 12px;
  margin: 0;
  line-height: normal;
}

.pokemon-retrieving,
.pokemon-sending {
  font-size: 1.8em;
  flex-grow: 1;
}

.pokemon-retrieving {
  color: #b53333;
}

.pokemon-sending {
  color: #33b540;
}

.icon {
  transform: scale(-1, 1);
}

.pokemon-offer-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  gap: 8px;
}

.container {
  display: flex;
  justify-content: center;
  gap: 40px 20px;
  flex-wrap: wrap;
  article {
    background: $dark;
  }
}

.offer {
  :hover {
    cursor: pointer;
  }
}

.pokemon-name {
  font-size: 24px;
  line-height: normal;
}

.pokemon-fullart {
  width: 50%;
}

.pokemon-dialog {
  display: flex;
  font-size: 13px;
}
</style>
