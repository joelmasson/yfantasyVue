import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { RouteRecordRaw } from "vue-router";

import { createPinia } from "pinia";

// import store  from './store'

import DashboardRoute from "./routes";

import "./style.css";
import App from "./App.vue";

const routes: Array<RouteRecordRaw> = DashboardRoute;

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.mount("#app");
