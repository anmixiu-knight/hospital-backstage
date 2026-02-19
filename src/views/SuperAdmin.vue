<template>
  <div class="admin-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>医生信息管理</span>
          <div class="button-group">
            <el-button type="primary" @click="showRegisterDialog = true"
              >注册新医生</el-button
            >
          </div>
        </div>
      </template>

      <el-table :data="doctorList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="username" label="医生用户名" />
        <el-table-column prop="phone" label="电话号码" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-popconfirm
              title="确定重置该医生的密码吗?"
              @confirm="handleResetPassword(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="warning">重置密码</el-button>
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

    <!-- Register Dialog -->
    <el-dialog v-model="showRegisterDialog" title="注册新医生" width="400px">
      <el-form :model="registerForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input
            v-model="registerForm.username"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="registerForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="registerForm.phone" placeholder="请输入电话号码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showRegisterDialog = false">取消</el-button>
          <el-button type="primary" @click="handleRegister">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRouter } from "vue-router";
import instance from "@/composable/api/interface";
import { useUserStore } from "@/stores/userStore";
import { ElMessage } from "element-plus";

const doctorList = ref([]);
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const limit = ref(10);
const showRegisterDialog = ref(false);
const router = useRouter();
const userStore = useUserStore();

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
    console.log(res);
    // Adapt to response structure
    if (res && res.doctors) {
      doctorList.value = res.doctors;
      total.value = res.total || res.doctors.length;
    } else {
      doctorList.value = [];
      total.value = 0;
    }
  } catch (error) {
    ElMessage.error("获取医生列表失败");
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
    ElMessage.warning("请填写完整信息");
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
    ElMessage.error(error.message || "注册失败");
  }
};

const handleResetPassword = async (id: string) => {
  try {
    await instance.put(`/admin/doctor/reset/${id}`);
    ElMessage.success("密码重置成功");
  } catch (error: any) {
    ElMessage.error(error.message || "重置密码失败");
  }
};

const handleLogout = () => {
  router.push("/login");
  userStore.logout();
};

onMounted(() => {
  fetchDoctors();
});
</script>

<style scoped>
.admin-container {
  /* padding: 20px; */ /* Padding is handled by MainLayout */
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
