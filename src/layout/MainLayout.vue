<template>
  <el-container class="layout-container">
    <el-aside width="220px" class="aside">
      <div class="logo">
        <el-icon class="logo-icon" :size="24"><FirstAidKit /></el-icon>
        <span>智慧医疗系统</span>
      </div>
      <el-menu
        active-text-color="#26a69a"
        background-color="transparent"
        class="el-menu-vertical"
        text-color="#fff"
        router
        :default-active="route.path"
      >
        <el-menu-item index="/diagnosis">
          <el-icon><Monitor /></el-icon>
          <span>患者记录</span>
        </el-menu-item>
        <el-menu-item index="/super-admin" v-if="store.level === 2">
          <el-icon><UserFilled /></el-icon>
          <span>医生信息管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-content">
          <div class="breadcrumb">
            <span class="crumb-path">首页</span>
            <span class="crumb-separator">/</span>
            <span class="crumb-current">{{ currentRouteName }}</span>
          </div>
          <div class="user-info">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                <el-avatar :size="32" class="user-avatar" icon="UserFilled" />
                <span class="username">{{ store.username || "管理员" }}</span>
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="changePassword"
                    >修改密码</el-dropdown-item
                  >
                  <el-dropdown-item command="logout" divided
                    >退出登录</el-dropdown-item
                  >
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

    <!-- Password Change Dialog -->
    <el-dialog v-model="showPasswordDialog" title="修改密码" width="400px">
      <el-form
        :model="passwordForm"
        ref="passwordFormRef"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPasswordDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitPasswordChange"
            :loading="loading"
          >
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </el-container>
</template>

<script setup lang="ts">
import { computed, ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "../stores/userStore";
import {
  FirstAidKit,
  Monitor,
  UserFilled,
  ArrowDown,
} from "@element-plus/icons-vue";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

const route = useRoute();
const router = useRouter();
const store = useUserStore();

const showPasswordDialog = ref(false);
const loading = ref(false);
const passwordFormRef = ref<FormInstance>();

const passwordForm = reactive({
  newPassword: "",
  confirmPassword: "",
});

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请再次输入密码"));
  } else if (value !== passwordForm.newPassword) {
    callback(new Error("两次输入密码不一致!"));
  } else {
    callback();
  }
};

const passwordRules = reactive<FormRules>({
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" },
  ],
  confirmPassword: [{ validator: validatePass2, trigger: "blur" }],
});

const currentRouteName = computed(() => {
  switch (route.path) {
    case "/diagnosis":
      return "患者记录";
    case "/super-admin":
      return "医生信息管理";
    default:
      return "仪表盘";
  }
});

const handleCommand = (command: string) => {
  if (command === "logout") {
    store.logout();
    router.push("/login");
  } else if (command === "changePassword") {
    showPasswordDialog.value = true;
    passwordForm.newPassword = "";
    passwordForm.confirmPassword = "";
  }
};

const submitPasswordChange = async () => {
  if (!passwordFormRef.value) return;
  await passwordFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      try {
        const success = await store.updatePassword(passwordForm.newPassword);
        if (success) {
          showPasswordDialog.value = false;
        }
      } finally {
        loading.value = false;
      }
    }
  });
};
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background: linear-gradient(180deg, #26a69a 0%, #4db6ac 100%);
  color: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  gap: 12px;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.el-menu-vertical {
  border-right: none;
  margin-top: 10px;
}

:deep(.el-menu-item) {
  margin: 4px 10px;
  border-radius: 8px;
  height: 50px;
}

:deep(.el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: #e0f2f1 !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header {
  background-color: #fff;
  height: 64px;
  border-bottom: 1px solid #eef0f2;
  display: flex;
  align-items: center;
  padding: 0 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
}

.header-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.breadcrumb {
  font-size: 14px;
  color: #606266;
}

.crumb-separator {
  margin: 0 8px;
  color: #c0c4cc;
}

.crumb-current {
  color: #26a69a;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  outline: none;
}

.user-avatar {
  background-color: #26a69a;
}

.username {
  margin-left: 10px;
  margin-right: 4px;
  font-weight: 500;
  color: #333;
}

.el-icon--right {
  color: #909399;
}

.main-content {
  background-color: #f5f7fa;
  padding: 24px; /* 恢复主内容的内边距 */
  overflow: hidden; /* 防止溢出, 让内部组件决定滚动 */
  display: flex;
  flex-direction: column;
}
</style>
