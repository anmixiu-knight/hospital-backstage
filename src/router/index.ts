import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";
import LoginView from "../views/LoginView.vue";
import MainLayout from "../layout/MainLayout.vue";
import DiagnosisHistory from "../views/DiagnosisHistory.vue";
import SuperAdmin from "../views/SuperAdmin.vue";
import { ElMessageBox } from "element-plus";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: LoginView,
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
        {
          path: "super-admin",
          name: "super-admin",
          component: SuperAdmin,
          meta: { requiresAdmin: true },
        },
      ],
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  await userStore.fetchCurrentUser();
  if (to.path !== "/login" && !userStore.isLoggedIn) {
    try {
      await ElMessageBox.confirm(
        "您当前未登录，不可查询，是否前往登录？",
        "提示",
        {
          confirmButtonText: "前往登录",
          cancelButtonText: "取消",
          type: "warning",
        },
      );
      next("/login");
    } catch {
      // User clicked cancel, abort navigation or stay on current page
      // If valid 'from' route exists, stay there. Otherwise (fresh load), maybe force login or show blank?
      // Typically next(false) aborts navigation.
      next(false);
    }
  } else if (
    to.matched.some((record) => record.meta.requiresAdmin) &&
    userStore.level !== 2
  ) {
    next("/");
  } else {
    next();
  }
});

export default router;
