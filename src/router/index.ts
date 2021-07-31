import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import axios from "axios";
import { getCookie, userStorage } from "@/storage";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/TodosUsuarios.vue"),
  },
  {
    path: "/market",
    name: "Mercado",
    component: () => import("../views/Market.vue"),
  },
  {
    path: "/oauth",
    name: "Redirect Oauth uri",
    component: () => import("../views/TodosUsuarios.vue"),
    beforeEnter: async (to, _from, next) => {
      const { code } = to.query;

      if (code) {
        const token = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/login`,
          {
            code,
          }
        );
        const userInfo = await axios.post(
          `${process.env.VUE_APP_BACKEND_URL}/@me`,
          token.data
        );
        userStorage.setToken(token.data);
        userStorage.setUserInfo(userInfo.data);
      }

      next(getCookie("lastUrl") || "/");
    },
  },
  {
    path: "/usuarios/:id",
    name: "Usuario",
    component: () => import("../views/Usuario.vue"),
  },
  {
    path: "/batalhas/:id",
    name: "Batalha",
    component: () => import("../views/Batalha.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
