import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";
import LoginView from "../views/LoginView.vue";
import MainLayout from "../layout/MainLayout.vue";
import DiagnosisHistory from "../views/DiagnosisHistory.vue";
import SuperAdmin from "../views/SuperAdmin.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/super-admin",
      name: "super-admin",
      component: SuperAdmin,
    },
    {
      path: "/",
      component: MainLayout,
      redirect: "/diagnosis",
      children: [
        {
          path: "diagnosis",
          name: "diagnosis",
          component: DiagnosisHistory,
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  await userStore.fetchCurrentUser();
  if (to.path !== "/login" && !userStore.isLoggedIn) {
    next("/login");
  } else if (to.path === "/super-admin" && userStore.level !== 2) {
    next("/");
  } else {
    next();
  }
});

export default router;
