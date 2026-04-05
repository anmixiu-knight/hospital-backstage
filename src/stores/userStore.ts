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

  const extractErrorDetail = (error: any, fallback = "请求失败") => {
    const raw =
      error?.response?.data?.message ||
      error?.message ||
      (typeof error === "string" ? error : "");
    const text = String(raw || fallback).trim();
    const idx = Math.max(text.lastIndexOf(":"), text.lastIndexOf("："));
    return idx >= 0 ? text.slice(idx + 1).trim() || fallback : text;
  };

  const handleLogin = async (usernameInput: string, passwordInput: string) => {
    lastError.value = null;
    try {
      const res: any = await instance.post("/user/login", {
        username: usernameInput,
        password: passwordInput,
      });

      ElMessage.success("登录成功");
      isLoggedIn.value = true;
      username.value = usernameInput;
      level.value = res.Level ?? res.level;
      reset.value = res.reset ?? 0;
    } catch (err: any) {
      isLoggedIn.value = false;
      level.value = 0;
      username.value = "";
      lastError.value = extractErrorDetail(err, "登录失败");
      ElMessage.error(lastError.value);
      throw err;
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    lastError.value = null;
    try {
      await instance.put("/user/update", { oldPassword, newPassword });
      ElMessage.success("密码修改成功");
      return true;
    } catch (error: any) {
      lastError.value = extractErrorDetail(error, "密码修改失败");
      ElMessage.error(lastError.value);
      return false;
    }
  };

  const fetchCurrentUser = async () => {
    lastError.value = null;
    try {
      const res: any = await instance.get("/user/status");
      username.value = res.username || "";
      isLoggedIn.value = true;
      level.value = res.Level ?? res.level;
    } catch (error: any) {
      isLoggedIn.value = false;
      username.value = "";
      level.value = 0;
      lastError.value = extractErrorDetail(error, "获取用户信息失败");
    }
  };

  const logout = async () => {
    lastError.value = null;
    try {
      await instance.delete("/user/logout");
      ElMessage.success("登出成功");
    } catch (error: any) {
      lastError.value = extractErrorDetail(error, "登出失败");
      ElMessage.error(lastError.value);
    } finally {
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
