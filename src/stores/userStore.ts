import { defineStore } from "pinia";
import { ref } from "vue";
import instance from "@/composable/api/interface";
import { ElMessage } from "element-plus";

export const useUserStore = defineStore("user", () => {
  const username = ref<string>("");
  const isLoggedIn = ref(false);
  const level = ref<number>(0);
  const reset = ref<number>(0);
  const lastError = ref<string | null>(null);

  const handleLogin = async (usernameInput: string, passwordInput: string) => {
    lastError.value = null;
    try {
      const res: any = await instance.post("/user/login", {
        username: usernameInput,
        password: passwordInput,
      });
      // console.log(res);
      ElMessage.success("登录成功");
      isLoggedIn.value = true;
      username.value = usernameInput; // 更新用户名

      // 后端一定会返回 Level 或 level，且值为 1 (医生) 或 2 (管理员)
      level.value = res.Level ?? res.level;
      reset.value = res.reset ?? 0;
    } catch (err: any) {
      isLoggedIn.value = false;
      level.value = 0;
      username.value = "";
      lastError.value =
        typeof err === "string" ? err : err.message || "登录失败，请稍后重试";
      ElMessage.error(lastError.value || "登录失败");
      throw err; // 抛出错误以便组件处理
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    lastError.value = null;
    try {
      await instance.put("/user/update", { oldPassword, newPassword });
      ElMessage.success("密码修改成功");
      return true;
    } catch (error: any) {
      lastError.value =
        typeof error === "string" ? error : error.message || "密码修改失败";
      ElMessage.error(lastError.value || "密码修改失败");
      return false;
    }
  };

  const fetchCurrentUser = async () => {
    lastError.value = null;
    try {
      const res: any = await instance.get("/user/status");
      username.value = res.username || "";
      isLoggedIn.value = true;
      // 恢复用户等级，防止刷新页面后权限丢失
      level.value = res.Level ?? res.level;
    } catch (error: any) {
      isLoggedIn.value = false;
      username.value = "";
      level.value = 0;
      lastError.value =
        typeof error === "string" ? error : error.message || "获取用户信息失败";
    }
  };

  const logout = async () => {
    lastError.value = null;
    try {
      await instance.delete("/user/logout");
      ElMessage.success("登出成功");
    } catch (error: any) {
      lastError.value =
        typeof error === "string" ? error : error.message || "登出失败";
      ElMessage.error(lastError.value || "登出失败");
    } finally {
      // 无论后端是否成功，前端都清理状态
      isLoggedIn.value = false;
      username.value = "";
      level.value = 0;
      reset.value = 0;
    }
  };

  return {
    username,
    isLoggedIn,
    level,
    reset,
    lastError,
    handleLogin,
    updatePassword,
    fetchCurrentUser,
    logout,
  };
});
