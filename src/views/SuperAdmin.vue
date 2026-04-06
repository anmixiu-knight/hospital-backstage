<template>
  <div class="admin-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>医生列表</span>
          <div class="button-group">
            <el-button type="primary" @click="showRegisterDialog = true">
              注册医生
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="doctorList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="username" label="医生姓名" />
        <el-table-column prop="phone" label="手机号" />

        <el-table-column label="修改权限" width="220">
          <template #default="scope">
            <el-popconfirm
              v-if="!isCurrentUser(scope.row) && !isLevelMinusDoctor(scope.row)"
              title="你确定要禁用该医生的账号吗?"
              @confirm="handleDeleteDoctor(scope.row)"
            >
              <template #reference>
                <el-button size="small" type="danger" :icon="Delete">禁用</el-button>
              </template>
            </el-popconfirm>

            <el-button
              v-else-if="!isCurrentUser(scope.row) && isLevelMinusDoctor(scope.row)"
              size="small"
              type="danger"
              :icon="Delete"
              disabled
            >
              禁用
            </el-button>
          </template>
        </el-table-column>

        <el-table-column label="重置密码" width="150">
          <template #default="scope">
            <el-popconfirm
              v-if="!isLevelMinusDoctor(scope.row)"
              title="你确定要重置该医生的密码吗？"
              @confirm="handleResetPassword(scope.row)"
            >
              <template #reference>
                <el-button size="small" type="warning">重置</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="limit"
          :total="total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <el-dialog v-model="showRegisterDialog" title="注册医生" width="400px">
      <el-form :model="registerForm" label-width="90px">
        <el-form-item label="医生姓名">
          <el-input v-model="registerForm.username" placeholder="请输入医生姓名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="registerForm.password"
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="registerForm.phone" placeholder="请输入手机号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRegisterDialog = false">取消</el-button>
          <el-button type="primary" @click="handleRegister">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog
      v-model="showResetSuccessDialog"
      title="密码重置成功"
      width="400px"
      center
    >
      <div style="text-align: center; font-size: 16px">
        <p>新密码:</p>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin: 15px 0;
            background: #f5f7fa;
            padding: 10px;
            border-radius: 4px;
          "
        >
          <strong style="color: #f56c6c; font-size: 20px; font-family: monospace">
            {{ resetNewPassword }}
          </strong>
          <el-button type="primary" link :icon="CopyDocument" @click="copyPassword" />
        </div>
        <p style="color: #909399; font-size: 14px">请妥善保管。</p>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="showResetSuccessDialog = false">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from "vue";
import instance from "@/composable/api/interface";
import { useUserStore } from "@/stores/userStore";
import { ElMessage } from "element-plus";
import { Delete, CopyDocument } from "@element-plus/icons-vue";

const doctorList = ref<any[]>([]);
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const limit = ref(10);
const showRegisterDialog = ref(false);
const showResetSuccessDialog = ref(false);
const resetNewPassword = ref("");
const userStore = useUserStore();
const currentUsername = computed(() => (userStore.username || "").trim());

const registerForm = reactive({
  username: "",
  password: "",
  phone: "",
});

const fetchDoctors = async () => {
  loading.value = true;
  try {
    const res: any = await instance.get("/admin/doctor/show", {
      params: {
        page: page.value,
        limit: limit.value,
      },
    });

    if (res && res.doctors) {
      doctorList.value = res.doctors;
      total.value = res.total || res.doctors.length;
    } else {
      doctorList.value = [];
      total.value = 0;
    }
  } catch (error) {
    ElMessage.error("未查询到医生数据");
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const handlePageChange = (val: number) => {
  page.value = val;
  fetchDoctors();
};

const handleRegister = async () => {
  if (!registerForm.username || !registerForm.password || !registerForm.phone) {
    ElMessage.warning("请填写所有字段");
    return;
  }

  try {
    await instance.post("/admin/doctor/register", registerForm);
    ElMessage.success("注册成功");
    showRegisterDialog.value = false;
    registerForm.username = "";
    registerForm.password = "";
    registerForm.phone = "";
    fetchDoctors();
  } catch (error: any) {
    ElMessage.error(error.message || "Register failed");
  }
};

const handleResetPassword = async (row: any) => {
  if (isLevelMinusDoctor(row)) return;

  try {
    const res: any = await instance.put(`/admin/doctor/reset/${row.id}`);
    const newPassword = res?.newPassword ? res.newPassword : JSON.stringify(res);
    resetNewPassword.value = newPassword;
    showResetSuccessDialog.value = true;
  } catch (error: any) {
    ElMessage.error(error.message || "重置密码失败");
  }
};

const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(resetNewPassword.value);
    ElMessage.success("已复制到剪贴板");
  } catch {
    ElMessage.error("复制失败，请手动复制");
  }
};

const handleDeleteDoctor = async (row: any) => {
  if (isLevelMinusDoctor(row)) return;

  try {
    await instance.delete(`/admin/doctor/delete/${row.id}`);
    ElMessage.success("禁用成功");
    fetchDoctors();
  } catch (error: any) {
    ElMessage.error(error.message || "禁用失败");
  }
};

const isCurrentUser = (row: any) => {
  return (row?.username || "").trim() === currentUsername.value;
};

const isLevelMinusDoctor = (row: any) => {
  const level = row?.level ?? row?.Level;
  return Number(level) === -1;
};

onMounted(async () => {
  if (!currentUsername.value) {
    await userStore.fetchCurrentUser();
  }
  fetchDoctors();
});
</script>

<style scoped>
.admin-container {
  /* padding: 20px; */
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
</style>
