import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/usuarios/:id",
    name: "Usuario",
    component: () => import("../views/Usuario.vue"),
  },
  {
    path: "/usuarios",
    name: "Todos Usuários",
    component: () => import("../views/TodosUsuarios.vue"),
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
