<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-left">
        <div class="brand-intro">
          <div class="logo-circle">
            <el-icon :size="40" color="#fff"><FirstAidKit /></el-icon>
          </div>
          <h1 class="welcome-title">智慧医疗</h1>
          <p class="welcome-desc">高效 · 智能 · 关怀</p>
          <p class="welcome-sub">Integrated Hospital Management System</p>

          <!-- 装饰性波浪 -->
          <svg
            class="waves"
            viewBox="0 24 150 28"
            preserveAspectRatio="none"
            shape-rendering="auto"
          >
            <defs>
              <path
                id="gentle-wave"
                d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
              />
            </defs>
            <g class="parallax">
              <use
                xlink:href="#gentle-wave"
                x="48"
                y="0"
                fill="rgba(255,255,255,0.7"
              />
              <use
                xlink:href="#gentle-wave"
                x="48"
                y="3"
                fill="rgba(255,255,255,0.5)"
              />
              <use
                xlink:href="#gentle-wave"
                x="48"
                y="5"
                fill="rgba(255,255,255,0.3)"
              />
              <use xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>
        </div>
      </div>

      <div class="login-right">
        <div class="login-form-box">
          <div class="form-header">
            <h3>欢迎登录</h3>
            <p>请输入您的帐号和密码进入系统</p>
          </div>

          <el-form :model="loginForm" label-width="0" size="large">
            <el-form-item>
              <el-input
                v-model="loginForm.username"
                placeholder="帐号 / Username"
              >
                <template #prefix>
                  <el-icon><User /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码 / Password"
                show-password
                @keyup.enter="handleLogin"
              >
                <template #prefix>
                  <el-icon><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                class="login-button"
                @click="handleLogin"
              >
                立即登录
              </el-button>
            </el-form-item>
          </el-form>

          <div class="form-footer">
            <span>忘记密码？请联系系统管理员</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { User, Lock, FirstAidKit } from "@element-plus/icons-vue";
import { useUserStore } from "../stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const loginForm = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  if (loginForm.value.username && loginForm.value.password) {
    await userStore.handleLogin(
      loginForm.value.username,
      loginForm.value.password,
    );

    if (userStore.isLoggedIn) {
      if (userStore.level === 2) {
        router.push("/super-admin");
      } else {
        router.push("/");
      }
    }
  } else {
    ElMessage.warning("请输入用户名和密码");
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #e0f7fa 0%, #e8f5e9 100%);
  overflow: hidden;
}

.login-wrapper {
  width: 900px;
  height: 550px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
}

.login-left {
  width: 50%;
  background: linear-gradient(135deg, #26a69a 0%, #4db6ac 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fff;
  position: relative;
  overflow: hidden;
}

.brand-intro {
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 60px; /* 为波浪留空间 */
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  backdrop-filter: blur(5px);
}

.welcome-title {
  font-size: 32px;
  margin-bottom: 10px;
  font-weight: 600;
  letter-spacing: 2px;
}

.welcome-desc {
  font-size: 16px;
  opacity: 0.9;
  letter-spacing: 4px;
  margin-bottom: 5px;
}

.welcome-sub {
  font-size: 12px;
  opacity: 0.7;
}

/* 波浪动画 */
.waves {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;
  z-index: 1;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(0.55, 0.5, 0.45, 0.5) infinite;
}
.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}
.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}
.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}
.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}
@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}

.login-right {
  width: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  background-color: #ffffff;
}

.login-form-box {
  width: 100%;
  max-width: 320px;
}

.form-header {
  margin-bottom: 40px;
}

.form-header h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 700;
}

.form-header p {
  color: #999;
  font-size: 14px;
}

.login-button {
  width: 100%;
  height: 44px;
  font-size: 16px;
  letter-spacing: 2px;
  background: linear-gradient(90deg, #26a69a 0%, #4db6ac 100%);
  border: none;
  border-radius: 4px;
  margin-top: 10px;
  transition: all 0.3s;
}

.login-button:hover {
  background: linear-gradient(90deg, #4db6ac 0%, #26a69a 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(38, 166, 154, 0.3);
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #ccc;
  font-size: 12px;
}

/* 覆盖 Element Plus 默认聚焦颜色为医疗绿 */
:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #26a69a inset !important;
}
</style>
