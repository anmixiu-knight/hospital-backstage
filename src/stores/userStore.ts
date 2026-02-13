import { defineStore } from "pinia";
import { ref } from "vue";
import instance from "@/composable/api/interface";
import { ElMessage } from "element-plus";

export const useUserStore = defineStore("user", () => {
  const username = ref<string>("");
  const isLoggedIn = ref(false);
  const level = ref<number>(0);
  const lastError = ref<string | null>(null);

  const handleLogin = async (username: string, password: string) => {
    try {
      const res: any = await instance.post("/user/login", {
        username,
        password,
      });
      console.log(res);
      ElMessage.success("登录成功");
      isLoggedIn.value = true;
      if (res && res.Level) {
        level.value = res.Level;
      }
    } catch (err: any) {
      lastError.value = String(err) || "登录失败，请稍后重试";
      ElMessage.error(lastError.value);
    }
  };

  const updatePassword = async (newPassword: string) => {
    lastError.value = null;
    try {
      await instance.put("/user/update", { newPassword });
      return true;
    } catch (error) {
      return false;
    }
  };

  const fetchCurrentUser = async () => {
    lastError.value = null;
    try {
      const res = (await instance.get("/user/status")) as any;
      username.value = res.username || "";
      isLoggedIn.value = true;
    } catch (error) {
      lastError.value = String(error);
    }
  };

  const logout = async () => {
    lastError.value = null;
    try {
      await instance.delete("/user/logout");
      isLoggedIn.value = false;
      ElMessage.success("登出成功");
    } catch (error) {
      lastError.value = String(error);
      ElMessage.error("登出失败，请稍后重试");
    } 
  };

  return {
    username,
    isLoggedIn,
    level,
    lastError,
    handleLogin,
    updatePassword,
    fetchCurrentUser,
    logout,
  };
});
