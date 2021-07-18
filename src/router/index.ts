import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/TodosUsuarios.vue"),
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
