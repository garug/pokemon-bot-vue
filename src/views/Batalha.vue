<template>
  <section class="main">
    <article
      v-for="index in 2"
      :key="index"
      class="card"
      :class="index === 1 ? 'p1' : 'p2'"
    >
      <header>
        {{
          ((index === 1 ? data.p1 : data.p2).inBattle.hp /
            (index === 1 ? data.p1 : data.p2).inBattle.totalHp) *
            100
        }}
        <div class="lifebar">
          <div
            :style="{
              width:
                ((index === 1 ? data.p1 : data.p2).inBattle.hp /
                  (index === 1 ? data.p1 : data.p2).inBattle.totalHp) *
                  100 +
                '%',
            }"
          ></div>
        </div>
      </header>
      <div class="activePokemon">
        <img
          :class="{
            defeated: (index === 1 ? data.p1 : data.p2).inBattle.hp <= 0,
          }"
          :src="
            `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${
              (index === 1 ? data.p1 : data.p2).inBattle.number
            }.gif`
          "
        />
      </div>
      <ul class="otherPokemon">
        <li
          v-for="(otherPokemon, i) in (index === 1 ? data.p1 : data.p2).pokemon"
          :key="i"
        >
          <img
            v-if="otherPokemon"
            class="bank"
            :class="{ defeated: otherPokemon.hp <= 0 }"
            :src="
              `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-viii/icons/${otherPokemon.number}.png`
            "
          />
          <img
            v-else
            src="https://github.com/PokeAPI/sprites/blob/master/sprites/items/poke-ball.png?raw=true"
          />
        </li>
      </ul>
    </article>
  </section>
  <section>
    <h1 v-if="result === identity" style="color: green">
      You Win!!
    </h1>
    <h1 v-if="result && result !== identity" style="color: red">
      You Lose!!
    </h1>
  </section>
  <article class="moves">
    <h1>Choose a move</h1>
    <button
      :disabled="data[identity].inBattle.hp <= 0"
      @click="registerAction(move, 'move')"
      v-for="move in data.moves"
      :key="move"
    >
      {{ move }}
    </button>
  </article>
  <article class="moves">
    <h1>Or change pokemon</h1>
    <button
      :disabled="pokemon.id === data[identity].inBattle.id || pokemon.hp <= 0"
      :class="pokemon.id"
      @click="registerAction(pokemon.name, 'change')"
      v-for="pokemon in data.available"
      :key="pokemon.name"
    >
      {{ pokemon.name }}
    </button>
  </article>
  <article class="events">
    <section v-for="(turn, i) in data.turns" :key="i">
      <p v-for="(event, i2) in turn" :key="i2">
        {{ event }}
      </p>
    </section>
  </article>
</template>

<script lang="ts">
import { useSocket } from "@/socket";
import { defineComponent, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const Batalha = defineComponent({
  name: "Batalha",

  setup() {
    const socket = useSocket();
    const route = useRoute();
    const router = useRouter();

    const key = ref(route.params.id as string);
    const battleKey = ref("");
    const identity = ref<"p1" | "p2">("p1");
    const winner = ref<"p1" | "p2" | undefined>();

    socket.emit("connect-battle", key.value);
    socket.on("roomNotFind", () => router.push("/"));

    socket.on("battle", (battle) => (battleKey.value = battle));

    socket.on("p1", (user) => {
      data.p1.inBattle = user.inBattle;
      data.p1.pokemon = user.pokemon;
      data.p1.pokemon.length = 6;
    });

    socket.on("actions", (actions) => {
      data.moves = actions.moves;
      data.available = actions.pokemon;
    });

    socket.on("p2", (user) => {
      data.p2.inBattle = user.inBattle;
      data.p2.pokemon = user.pokemon;
      data.p2.pokemon.length = 6;
    });

    socket.on("event", (event) =>
      data.turns[data.turns.length - 1].push(event)
    );

    socket.on("events", (events) => (data.turns = events));

    socket.on("winner", (w) => (winner.value = w));

    socket.on("identity", (i) => (identity.value = i));

    socket.on("changePokemon", (change) => {
      const player = change.player as "p1" | "p2";
      const alreadyInPlay = data[player].pokemon
        .filter((e) => e)
        .find((e) => e.id === change.in.id);

      if (!alreadyInPlay) {
        const index = data[player].pokemon.findIndex((e) => !e);
        data[player].pokemon[index] = change.in;
      }

      data[player].inBattle = change.in;
    });

    socket.on("resultDamage", (result) => {
      const player: "p1" | "p2" = result.target;
      data[player].inBattle.hp -= result.damage;
    });

    socket.on("pokemonDefeated", (e) => {
      const pokemon = data.available.find((a: any) => a.id === e.pokemon.id);
      if (pokemon) pokemon.hp = 0;
    });

    const data = reactive({
      turns: [] as String[][],
      available: [] as any,
      moves: [],
      p1: {
        inBattle: {
          id: "",
          name: "dragapult",
          originalPokemon: {},
          number: 144,
          hp: 100,
          totalHp: 100,
        },
        pokemon: [
          { name: "dragapult", id: "", number: 16, hp: 100, totalHp: 100 },
        ],
      },
      p2: {
        inBattle: {
          id: "",
          name: "dragapult",
          originalPokemon: {},
          number: 144,
          hp: 100,
          totalHp: 100,
        },
        pokemon: [
          { name: "dragapult", id: "", number: 16, hp: 100, totalHp: 100 },
        ],
      },
    });

    const registerAction = (value: string, type: "move" | "change") => {
      socket.emit("registerTurn", {
        id: battleKey.value,
        type,
        value,
      });
    };
    return { data, identity, winner, registerAction };
  },
});

export default Batalha;
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
}

.p1 img {
  transform: scaleX(-1);
}

.activePokemon {
  flex-grow: 1;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  overflow: hidden;
}

.activePokemon .defeated {
  transform: translateY(80px);
  transition: transform ease 2s 0.5s;
}
.otherPokemon {
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: baseline;
}

.otherPokemon li {
  list-style: none;
  display: flex;
  justify-content: center;
}

.bank {
  width: 100%;
}

.defeated {
  filter: grayscale(1);
}

.lifebar {
  height: 8px;
  border-radius: 8px;
  width: 100px;
  background: #888;
  overflow: hidden;
  padding: 2px;
}

.lifebar div {
  border-radius: 8px;
  background: #2ecc71;
  height: 100%;
}

.events {
  background: #eee;
  max-height: 250px;
  overflow-y: auto;
}

.events p {
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}
</style>
