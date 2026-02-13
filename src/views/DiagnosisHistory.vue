<template>
  <div class="diagnosis-history">
    <el-card class="query-card" shadow="hover">
      <el-form
        :inline="false"
        :model="queryParams"
        class="demo-form-inline"
        label-width="100px"
      >
        <!-- Main Search Fields -->
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="病历单号">
              <el-input
                v-model="queryParams.clinicNumber"
                placeholder="请输入病历号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="医生ID">
              <el-input
                v-model="queryParams.doctorId"
                placeholder="请输入医生ID"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="风险等级">
              <el-select
                v-model="queryParams.riskLevel"
                placeholder="请选择风险等级"
                clearable
                style="width: 100%"
              >
                <el-option label="Low Risk" value="Low Risk" />
                <el-option label="Moderate Risk" value="Moderate Risk" />
                <el-option label="High Risk" value="High Risk" />
                <el-option label="Very High Risk" value="Very High Risk" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="备注搜索">
              <el-input
                v-model="queryParams.comment"
                placeholder="关键字"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Advanced Filters -->
        <el-collapse
          v-model="activeNames"
          style="border: none; margin-bottom: 20px"
        >
          <el-collapse-item title="高级筛选 (点击展开/收起)" name="1">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="年龄范围">
                  <el-col :span="11">
                    <el-input-number
                      v-model="queryParams.age_min"
                      :min="0"
                      placeholder="Min"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-col>
                  <el-col :span="2" class="text-center">-</el-col>
                  <el-col :span="11">
                    <el-input-number
                      v-model="queryParams.age_max"
                      :min="0"
                      placeholder="Max"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="息肉数量">
                  <el-col :span="11">
                    <el-input-number
                      v-model="queryParams.polypsNumber_min"
                      :min="0"
                      placeholder="Min"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-col>
                  <el-col :span="2" class="text-center">-</el-col>
                  <el-col :span="11">
                    <el-input-number
                      v-model="queryParams.polypsNumber_max"
                      :min="0"
                      placeholder="Max"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20" style="margin-top: 10px">
              <el-col :span="12">
                <el-form-item label="长径范围">
                  <el-col :span="11">
                    <el-input-number
                      v-model="queryParams.longDiameter_min"
                      :min="0"
                      placeholder="Min"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-col>
                  <el-col :span="2" class="text-center">-</el-col>
                  <el-col :span="11">
                    <el-input-number
                      v-model="queryParams.longDiameter_max"
                      :min="0"
                      placeholder="Max"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="短径范围">
                  <el-col :span="11">
                    <el-input-number
                      v-model="queryParams.shortDiameter_min"
                      :min="0"
                      placeholder="Min"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-col>
                  <el-col :span="2" class="text-center">-</el-col>
                  <el-col :span="11">
                    <el-input-number
                      v-model="queryParams.shortDiameter_max"
                      :min="0"
                      placeholder="Max"
                      controls-position="right"
                      style="width: 100%"
                    />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 10px">
              <el-col :span="6">
                <el-form-item label="基底类型">
                  <el-select
                    v-model="queryParams.baseType"
                    placeholder="请选择基底类型"
                    clearable
                  >
                    <el-option label="有蒂型" value="1" />
                    <el-option label="广基型" value="2" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>

        <el-row style="justify-content: flex-end">
          <el-button type="primary" @click="handleSearch" :loading="loading"
            >搜索</el-button
          >
          <el-button @click="resetQuery">重置</el-button>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="records-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-title">查询结果</span>
          <div class="header-operations">
            <el-button type="primary" plain @click="dialogVisible = true">
              <el-icon><Plus /></el-icon> 添加患者
            </el-button>
            <el-button
              type="success"
              @click="handleExport"
              :disabled="!tableData.length"
              plain
            >
              <el-icon><Download /></el-icon> 导出数据
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
        stripe
      >
        <el-table-column prop="clinicNumber" label="病历单号" width="130" />
        <el-table-column prop="doctorId" label="医生ID" width="100" />
        <el-table-column prop="age" label="年龄" width="80" />
        <el-table-column prop="polypsNumber" label="息肉数" width="90" />
        <el-table-column label="直径 (长/短)" width="140">
          <template #default="scope">
            {{ scope.row.longDiameter }} / {{ scope.row.shortDiameter }}
          </template>
        </el-table-column>
        <el-table-column label="基底类型" width="80">
          <template #default="scope">
            {{ getBaseTypeLabel(scope.row.baseType) }}
          </template>
        </el-table-column>
        <el-table-column label="风险等级" width="120">
          <template #default="scope">
            <el-tag :type="getRiskType(scope.row.risk_level)">{{
              scope.row.risk_level
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否恶性" width="130">
          <template #default="scope">
            <div class="malignant-cell">
              <el-tag
                :type="getMalignantInfo(scope.row.is_worse).type"
                effect="dark"
              >
                {{ getMalignantInfo(scope.row.is_worse).label }}
              </el-tag>
              <el-button
                type="primary"
                link
                icon="Edit"
                @click="openMalignantEdit(scope.row)"
                class="edit-btn"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="advice" label="AI医嘱" show-overflow-tooltip />
        <el-table-column label="备注" min-width="180">
          <template #default="scope">
            <div class="comment-cell">
              <span class="comment-text">{{ scope.row.comment || "无" }}</span>
              <el-button
                type="primary"
                link
                icon="Edit"
                @click="openCommentDialog(scope.row)"
                class="edit-btn"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="诊断时间" width="110">
          <template #default="scope">
            {{ formatDate(scope.row.formTime) }}
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="total > 0">
        <el-pagination
          v-model:current-page="queryParams.page"
          :total="total"
          layout="total, prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- Malignant Edit Dialog -->
    <el-dialog
      v-model="editMalignantDialogVisible"
      title="修改是否恶性"
      width="300px"
      align-center
    >
      <div style="text-align: center">
        <el-radio-group v-model="editMalignantValue">
          <el-radio label="-1" border>恶性</el-radio>
          <el-radio label="1" border>良性</el-radio>
          <el-radio label="0" border>未知</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editMalignantDialogVisible = false"
            >取消</el-button
          >
          <el-button type="primary" @click="handleMalignantUpdate">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="dialogVisible"
      title="添加患者信息"
      width="500px"
      :before-close="handleClose"
    >
      <el-form
        ref="patientFormRef"
        :model="patientForm"
        :rules="formRules"
        label-width="100px"
      >
        <!-- 病历单号 -->
        <el-form-item label="病历单号" prop="clinicNum">
          <el-input
            v-model="patientForm.clinicNum"
            placeholder="请输入病历单号"
            clearable
          />
        </el-form-item>

        <!-- 年龄 -->
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="patientForm.age"
            :min="0"
            :max="150"
            placeholder="请输入年龄"
            style="width: 100%"
          />
        </el-form-item>

        <!-- 息肉数量 -->
        <el-form-item label="息肉数量" prop="polypsNum">
          <el-input-number
            v-model="patientForm.polypsNum"
            :min="0"
            placeholder="请输入息肉数量"
            style="width: 100%"
          />
        </el-form-item>

        <!-- 长径 -->
        <el-form-item label="长径(mm)" prop="longDiameter">
          <el-input-number
            v-model="patientForm.longDiameter"
            :min="0"
            :precision="1"
            :step="0.1"
            placeholder="请输入长径"
            style="width: 100%"
          />
        </el-form-item>

        <!-- 短径 -->
        <el-form-item label="短径(mm)" prop="shortDiameter">
          <el-input-number
            v-model="patientForm.shortDiameter"
            :min="0"
            :precision="1"
            :step="0.1"
            placeholder="请输入短径"
            style="width: 100%"
          />
        </el-form-item>

        <!-- 基底类型 -->
        <el-form-item label="基底类型" prop="baseType">
          <el-select
            v-model="patientForm.baseType"
            placeholder="请选择基底类型"
            style="width: 100%"
          >
            <el-option label="有蒂型" value="1" />
            <el-option label="广基型" value="2" />
          </el-select>
        </el-form-item>

        <!-- 是否恶性 -->
        <el-form-item label="是否恶性">
          <el-select
            v-model="patientForm.isWorse"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option label="是" :value="-1" />
            <el-option label="否" :value="1" />
            <el-option label="待定" :value="0" />
          </el-select>
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注">
          <el-input
            v-model="patientForm.comment"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息（非必填）"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import instance from "@/composable/api/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import { Download, Plus, Edit } from "@element-plus/icons-vue";
import * as XLSX from "xlsx";

const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const activeNames = ref([]);

// Malignant Edit State
const editMalignantDialogVisible = ref(false);
const editMalignantValue = ref("0");
const currentEditRow = ref<any>(null);

const queryParams = reactive({
  page: 1,
  limit: 10,
  doctorId: "",
  clinicNumber: "",
  age_min: undefined,
  age_max: undefined,
  polypsNumber_min: undefined,
  polypsNumber_max: undefined,
  longDiameter_min: undefined,
  longDiameter_max: undefined,
  shortDiameter_min: undefined,
  shortDiameter_max: undefined,
  baseType: "",

  riskLevel: "",
  comment: "",
});

const handleSearch = async () => {
  loading.value = true;
  try {
    const res: any = await instance.get("/backstage/get", {
      params: queryParams,
    });
    console.log(res);
    tableData.value = res.forms || [];
    total.value = res.total || 0;
    if (tableData.value.length === 0) {
      ElMessage.info("未查询到相关数据");
    }
  } catch (err: any) {
    ElMessage.error(err.message || "查询失败");
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const resetQuery = () => {
  queryParams.doctorId = "";
  queryParams.clinicNumber = "";
  queryParams.age_min = undefined;
  queryParams.age_max = undefined;
  queryParams.polypsNumber_min = undefined;
  queryParams.polypsNumber_max = undefined;
  queryParams.longDiameter_min = undefined;
  queryParams.longDiameter_max = undefined;
  queryParams.shortDiameter_min = undefined;
  queryParams.shortDiameter_max = undefined;
  queryParams.baseType = "";
  queryParams.riskLevel = "";
  queryParams.comment = "";
  queryParams.page = 1;
  handleSearch();
};
interface DoctorRow {
  formId: string;
  isWorse?: string;
  comment?: string;
}

const openMalignantEdit = (row: any) => {
  currentEditRow.value = row;
  editMalignantValue.value =
    row.is_worse !== undefined && row.is_worse !== null
      ? String(row.is_worse)
      : "0";
  editMalignantDialogVisible.value = true;
};

const handleMalignantUpdate = async () => {
  if (!currentEditRow.value) return;
  try {
    const params: DoctorRow = {
      formId: currentEditRow.value.formId,
      isWorse: String(editMalignantValue.value),
    };

    await instance.put("/doctor/update", null, {
      params: params,
    });

    currentEditRow.value.is_worse = editMalignantValue.value;
    ElMessage.success("状态已更新");
    editMalignantDialogVisible.value = false;
  } catch (error: any) {
    console.error("更新失败:", error);
    ElMessage.error(error?.response?.data?.message || "更新失败，请重试");
  }
};

const openCommentDialog = async (row: any) => {
  try {
    const result = await ElMessageBox.prompt("请输入新的备注内容", "修改备注", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      inputValue: row.comment || "",
      inputType: "textarea",
    });
    const { value } = result as { value: string; action: string };
    const params: DoctorRow = {
      formId: row.formId,
      comment: value.trim(),
    };
    await instance.put("/doctor/update", null, {
      params: params,
    });

    row.comment = value.trim();
    ElMessage.success("备注已更新");
  } catch (error: any) {
    // 区分用户取消和真实错误
    if (error === "cancel" || error === "close") {
      // 用户取消操作，不处理
      return;
    }

    console.error("更新备注失败:", error);
    ElMessage.error(error?.response?.data?.message || "更新失败，请重试");
  }
};

const handlePageChange = (val: number) => {
  queryParams.page = val;
  handleSearch();
};

const getRiskType = (riskLevel: string) => {
  const typeMap: Record<string, string> = {
    "Low Risk": "success",
    "Moderate Risk": "warning",
    "High Risk": "danger",
    "Very High Risk": "danger",
    "Unknown Risk": "info",
  };
  return typeMap[riskLevel];
};

const getMalignantInfo = (status: string | undefined) => {
  if (status === "-1") return { label: "恶性", type: "danger" };
  if (status === "1") return { label: "良性", type: "success" };
  return { label: "未知", type: "info" };
};

const getBaseTypeLabel = (baseType: any) => {
  const typeMap: Record<string, string> = {
    "1": "有蒂型",
    "2": "广基型",
  };
  return typeMap[String(baseType)];
};

const formatDate = (dateValue: any) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "-";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 获取所有分页数据
const fetchAllData = async () => {
  try {
    let allData: any[] = [];
    const pageSize = queryParams.limit;
    const totalPages = Math.ceil(total.value / pageSize);

    for (let page = 1; page <= totalPages; page++) {
      const params = { ...queryParams, page };
      const res: any = await instance.get("/backstage/get", { params });
      allData = allData.concat(res.forms || []);
    }
    return allData;
  } catch (err: any) {
    ElMessage.error(err.message || "数据加载失败");
    throw err;
  }
};

const handleExport = async () => {
  if (!tableData.value.length && total.value === 0) {
    ElMessage.warning("没有可导出的数据");
    return;
  }

  try {
    // 获取所有分页数据
    const allData = await fetchAllData();

    if (!allData.length) {
      ElMessage.warning("没有可导出的数据");
      return;
    }

    const headers = [
      "病历单号",
      "医生ID",
      "年龄",
      "息肉数量",
      "长径",
      "短径",
      "基底类型",
      "风险概率",
      "风险等级",
      "是否恶性",
      "AI医嘱",
      "备注",
      "诊断时间",
    ];

    const rows = allData.map((d: any) => [
      d.clinicNumber,
      d.doctorId,
      d.age,
      d.polypsNumber,
      d.longDiameter,
      d.shortDiameter,
      getBaseTypeLabel(d.baseType),
      d.probability,
      d.risk_level,
      getMalignantInfo(d.is_worse).label,
      d.advice || "",
      d.comment || "",
      formatDate(d.formTime),
    ]);

    // 创建工作簿和工作表
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "诊断数据");

    // 导出Excel文件
    const fileName = `Diagnosis_Export_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, fileName);

    ElMessage.success(`导出成功，共 ${allData.length} 条数据`);
  } catch (error: any) {
    ElMessage.error("导出失败，请重试");
    console.error("导出错误:", error);
  }
};
// 控制弹窗显示
const dialogVisible = ref(false);

// 表单数据
const patientForm = reactive({
  clinicNum: "",
  age: null,
  polypsNum: null,
  longDiameter: null,
  shortDiameter: null,
  baseType: "",
  isWorse: "",
  comment: "",
});

// 表单引用
const patientFormRef = ref();

// 表单验证规则
const formRules = {
  medicalRecordNo: [
    { required: true, message: "请输入病历单号", trigger: "blur" },
  ],
  age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
  polypCount: [{ required: true, message: "请输入息肉数量", trigger: "blur" }],
  length: [{ required: true, message: "请输入长径", trigger: "blur" }],
  width: [{ required: true, message: "请输入短径", trigger: "blur" }],
  baseType: [{ required: true, message: "请选择基底类型", trigger: "change" }],
};

// 弹窗关闭前的处理
const handleClose = (done: any) => {
  ElMessageBox.confirm("确认关闭？未保存的数据将丢失", "提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      // 重置表单
      patientFormRef.value?.resetFields();
      done();
    })
    .catch(() => {
      // 取消关闭
    });
};

// 提交表单
const handleSubmit = async () => {
  if (!patientFormRef.value) return;

  try {
    try {
      await patientFormRef.value.validate();
    } catch (validateError: any) {
      console.log("表单验证失败:", validateError);
      ElMessage.warning("请填写完整的表单信息");
      return; // 直接返回，不继续执行
    }
    if (!patientForm.clinicNum?.trim()) {
      ElMessage.warning("请输入病历单号");
      return;
    }
    try {
      const registerRes = await instance.post("doctor/patient/register", {
        clinicNumber: patientForm.clinicNum,
      });
      console.log("患者注册响应:", registerRes);
    } catch (error: any) {
      console.error("注册请求网络错误:", error);
      ElMessage.error("网络请求失败，请稍后重试");
      return; // 终止整个提交
    }
    console.log("提交的患者信息:", { ...patientForm });
    const res = (await instance.post("doctor/save", {
      clinicNumber: patientForm.clinicNum,
      age: patientForm.age,
      polypsNumber: patientForm.polypsNum,
      longDiameter: patientForm.longDiameter,
      shortDiameter: patientForm.shortDiameter,
      baseType: Number(patientForm.baseType),
      probability: 0,
      riskLevel: "",
      advice: "",
    })) as any;
    console.log("保存患者信息响应:", res);
    const formID = res.formId;
    const params: DoctorRow = {
      formId: formID,
      isWorse: patientForm.isWorse || "0",
      comment: patientForm.comment || "",
    };

    await instance.put("/doctor/update", null, {
      params: params,
    });
    ElMessage.success("患者信息添加成功！");

    // 关闭弹窗并重置表单
    dialogVisible.value = false;
    patientFormRef.value.resetFields();
  } catch (error: any) {
    console.error("提交失败:", error);

    // 统一错误提示
    ElMessage.error("操作失败，请稍后重试");
  } finally {
    // 刷新数据
    handleSearch();
  }
};

onMounted(() => {
  handleSearch();
});
</script>

<style scoped>
.diagnosis-history {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.query-card {
  margin-bottom: 20px;
  border-radius: 8px;
}
.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.records-card {
  min-height: 500px;
  border-radius: 8px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}
.header-operations {
  display: flex;
  gap: 12px;
}
.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
:deep(.el-card__header) {
  padding: 15px 20px;
  .comment-cell {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .malignant-cell {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .comment-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-right: 8px;
  }
  .edit-btn {
    opacity: 0;
    transition: opacity 0.2s;
  }
  .comment-cell:hover .edit-btn,
  .malignant-cell:hover .edit-btn {
    opacity: 1;
  }
  border-bottom: 1px solid #ebeef5;
}
.el-form-item {
  margin-bottom: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
