<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <el-icon class="logo-icon"><FirstAidKit /></el-icon>
        <span>后台管理系统</span>
      </div>
      <el-menu
        active-text-color="#409EFF"
        background-color="#304156"
        class="el-menu-vertical"
        text-color="#bfcbd9"
        router
        :default-active="$route.path"
      >
        <el-menu-item index="/diagnosis">
          <el-icon><Monitor /></el-icon>
          <span>患者记录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <div class="breadcrumb">首页 / {{ currentRouteName }}</div>
          <div class="user-info">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <el-avatar :size="32" icon="UserFilled" />
                <span class="username">{{ store.username }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from "vue";
FirstAidKit;
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import {
  FirstAidKit,
  User,
  Monitor,
  UserFilled,
  ArrowDown,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const route = useRoute();
const router = useRouter();
const store = useUserStore();

const currentRouteName = computed(() => {
  switch (route.path) {
    case "/diagnosis":
      return "患者记录";
    default:
      return "仪表盘";
  }
});

const handleCommand = (command: string) => {
  if (command === "logout") {
    router.push("/login");
    store.logout();
  }
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  background-color: #2b3649;
  color: white;
  gap: 10px;
}

.el-menu-vertical {
  border-right: none;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-weight: 500;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
