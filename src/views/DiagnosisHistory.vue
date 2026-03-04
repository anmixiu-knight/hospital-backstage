<template>
  <div class="diagnosis-history">
    <el-card class="query-card" shadow="never">
      <div class="search-header">
        <div class="title">数据筛选</div>
        <div class="actions">
          <el-button
            type="primary"
            icon="Search"
            @click="handleSearch"
            :loading="loading"
            class="search-btn"
          >
            搜索
          </el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          <el-button link type="primary" @click="isAdvanced = !isAdvanced">
            {{ isAdvanced ? "收起筛选" : "高级筛选" }}
            <el-icon class="el-icon--right">
              <component :is="isAdvanced ? 'ArrowUp' : 'ArrowDown'" />
            </el-icon>
          </el-button>
        </div>
      </div>

      <el-form :model="queryParams" label-width="90px" class="search-form">
        <el-row :gutter="24">
          <el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="病历单号">
              <el-input
                v-model="queryParams.clinicNumber"
                placeholder="请输入病历号"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="医生姓名">
              <el-input
                v-model="queryParams.doctorName"
                placeholder="请输入医生姓名"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="风险等级">
              <el-select
                v-model="queryParams.riskLevel"
                placeholder="全部等级"
                clearable
                style="width: 100%"
              >
                <el-option label="Low Risk" value="Low Risk">
                  <span style="float: left">Low Risk</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                    >低风险</span
                  >
                </el-option>
                <el-option label="Moderate Risk" value="Moderate Risk">
                  <span style="float: left">Moderate Risk</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                    >中风险</span
                  >
                </el-option>
                <el-option label="High Risk" value="High Risk">
                  <span style="float: left">High Risk</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                    >高风险</span
                  >
                </el-option>
                <el-option label="Very High Risk" value="Very High Risk">
                  <span style="float: left">Very High Risk</span>
                  <span
                    style="
                      float: right;
                      color: var(--el-text-color-secondary);
                      font-size: 13px;
                    "
                    >极高风险</span
                  >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="备注搜索">
              <el-input
                v-model="queryParams.comment"
                placeholder="关键词"
                clearable
                @keyup.enter="handleSearch"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 高级筛选区域 -->
        <transition name="el-zoom-in-top">
          <div v-show="isAdvanced" class="advanced-filters">
            <el-divider content-position="left">高级选项</el-divider>
            <el-row :gutter="24">
              <el-col :span="8" :xs="24" :sm="12" :lg="8">
                <el-form-item label="年龄范围">
                  <div class="range-input-group">
                    <el-input-number
                      v-model="queryParams.age_min"
                      :min="0"
                      placeholder="Min"
                      controls-position="right"
                      :controls="false"
                      class="range-item"
                    />
                    <span class="range-separator">-</span>
                    <el-input-number
                      v-model="queryParams.age_max"
                      :min="0"
                      placeholder="Max"
                      controls-position="right"
                      :controls="false"
                      class="range-item"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8" :xs="24" :sm="12" :lg="8">
                <el-form-item label="息肉数量">
                  <div class="range-input-group">
                    <el-input-number
                      v-model="queryParams.polypsNumber_min"
                      :min="0"
                      placeholder="Min"
                      controls-position="right"
                      :controls="false"
                      class="range-item"
                    />
                    <span class="range-separator">-</span>
                    <el-input-number
                      v-model="queryParams.polypsNumber_max"
                      :min="0"
                      placeholder="Max"
                      controls-position="right"
                      :controls="false"
                      class="range-item"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8" :xs="24" :sm="12" :lg="8">
                <el-form-item label="基底类型">
                  <el-radio-group
                    v-model="queryParams.baseType"
                    class="radio-group-full"
                  >
                    <el-radio-button label="">全部</el-radio-button>
                    <el-radio-button label="1">有蒂型</el-radio-button>
                    <el-radio-button label="2">广基型</el-radio-button>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="8" :xs="24" :sm="12" :lg="8">
                <el-form-item label="长径范围">
                  <div class="range-input-group">
                    <el-input-number
                      v-model="queryParams.longDiameter_min"
                      :min="0"
                      placeholder="Min"
                      controls-position="right"
                      :controls="false"
                      class="range-item"
                    />
                    <span class="range-separator">-</span>
                    <el-input-number
                      v-model="queryParams.longDiameter_max"
                      :min="0"
                      placeholder="Max"
                      controls-position="right"
                      :controls="false"
                      class="range-item"
                    />
                    <span class="unit">mm</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="8" :xs="24" :sm="12" :lg="8">
                <el-form-item label="短径范围">
                  <div class="range-input-group">
                    <el-input-number
                      v-model="queryParams.shortDiameter_min"
                      :min="0"
                      placeholder="Min"
                      controls-position="right"
                      :controls="false"
                      class="range-item"
                    />
                    <span class="range-separator">-</span>
                    <el-input-number
                      v-model="queryParams.shortDiameter_max"
                      :min="0"
                      placeholder="Max"
                      controls-position="right"
                      :controls="false"
                      class="range-item"
                    />
                    <span class="unit">mm</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </transition>
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
        <el-table-column prop="doctorName" label="医生姓名" width="100" />
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
        <el-table-column label="AI医嘱" show-overflow-tooltip>
          <template #default="scope">
            {{ getAdviceLabel(scope.row.advice) }}
          </template>
        </el-table-column>
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
        <el-table-column label="操作" width="80" fixed="right">
          <template #default="scope">
            <el-popconfirm
              title="确定要删除这条记录吗？"
              @confirm="handleDelete(scope.row)"
              confirm-button-text="确定"
              cancel-button-text="取消"
            >
              <template #reference>
                <el-button type="danger" size="small">删除</el-button>
              </template>
            </el-popconfirm>
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
      width="400px"
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
      width="600px"
      :before-close="handleClose"
      class="custom-dialog"
      align-center
    >
      <div class="required-hint">
        <span class="required-star">*</span> 为必填项
      </div>
      <el-form
        ref="patientFormRef"
        :model="patientForm"
        :rules="formRules"
        label-position="top"
        class="patient-form"
      >
        <el-row :gutter="24">
          <!-- 病历单号 -->
          <el-col :span="12">
            <el-form-item
              label="病历单号 (Medical Record No.)"
              prop="clinicNum"
            >
              <el-input
                v-model="patientForm.clinicNum"
                placeholder="请输入病历单号"
                clearable
              >
                <template #prefix>
                  <el-icon><Document /></el-icon>
                </template>
              </el-input>
            </el-form-item>
          </el-col>

          <!-- 年龄 -->
          <el-col :span="12">
            <el-form-item label="年龄 (Age)" prop="age">
              <el-input-number
                v-model="patientForm.age"
                :min="0"
                :max="150"
                placeholder="请输入年龄"
                style="width: 100%"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="24">
          <!-- 息肉数量 -->
          <el-col :span="12">
            <el-form-item label="息肉数量 (Count)" prop="polypsNum">
              <el-input-number
                v-model="patientForm.polypsNum"
                :min="0"
                placeholder="请输入息肉数量"
                style="width: 100%"
                controls-position="right"
              />
            </el-form-item>
          </el-col>

          <!-- 基底类型 -->
          <el-col :span="12">
            <el-form-item label="基底类型 (Base Type)" prop="baseType">
              <el-select
                v-model="patientForm.baseType"
                placeholder="请选择基底类型"
                style="width: 100%"
              >
                <el-option label="有蒂型 (Pedunculated)" value="1" />
                <el-option label="广基型 (Sessile)" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">息肉尺寸 (Polyp Size)</el-divider>

        <el-row :gutter="24">
          <!-- 长径 -->
          <el-col :span="12">
            <el-form-item label="长径 (Long Diameter)" prop="longDiameter">
              <el-input-number
                v-model="patientForm.longDiameter"
                :min="0"
                :precision="1"
                :step="0.1"
                placeholder="0.0"
                style="width: 100%"
                controls-position="right"
              >
                <template #suffix>
                  <span>mm</span>
                </template>
              </el-input-number>
            </el-form-item>
          </el-col>

          <!-- 短径 -->
          <el-col :span="12">
            <el-form-item label="短径 (Short Diameter)" prop="shortDiameter">
              <el-input-number
                v-model="patientForm.shortDiameter"
                :min="0"
                :precision="1"
                :step="0.1"
                placeholder="0.0"
                style="width: 100%"
                controls-position="right"
              >
                <template #suffix>
                  <span>mm</span>
                </template>
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">其他信息 (Optional)</el-divider>

        <el-row :gutter="24">
          <!-- 是否恶性 -->
          <el-col :span="12">
            <el-form-item label="是否恶性 (Malignant)">
              <el-select
                v-model="patientForm.isWorse"
                placeholder="请选择(非必填)"
                style="width: 100%"
                clearable
              >
                <el-option label="是 (Yes)" :value="-1" />
                <el-option label="否 (No)" :value="1" />
                <el-option label="待定 (Pending)" :value="0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <!-- 备注 -->
            <el-form-item label="备注 (Comments)">
              <el-input
                v-model="patientForm.comment"
                type="textarea"
                :rows="2"
                placeholder="请输入备注信息"
                maxlength="200"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit" icon="Check"
            >提交保存</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import instance from "@/composable/api/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  Download,
  Plus,
  Edit,
  Search,
  Refresh,
  ArrowUp,
  ArrowDown,
  Check,
  Document,
} from "@element-plus/icons-vue";
import * as XLSX from "xlsx";

const loading = ref(false);
const tableData = ref([]);
const total = ref(0);
const isAdvanced = ref(false);

// Malignant Edit State
const editMalignantDialogVisible = ref(false);
const editMalignantValue = ref("0");
const currentEditRow = ref<any>(null);

const queryParams = reactive({
  page: 1,
  limit: 10,
  doctorId: "",
  doctorName: "",
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

const handleDelete = async (row: any) => {
  try {
    if (!row.formId) {
      ElMessage.warning("表单ID无效");
      return;
    }
    await instance.delete(`/doctor/delete/${row.formId}`);
    ElMessage.success("删除成功");
    // 重新获取数据
    handleSearch();
  } catch (error: any) {
    console.error("删除失败:", error);
    ElMessage.error(error?.response?.data?.message || "删除失败，请重试");
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

const getAdviceLabel = (advice: string | undefined) => {
  if (!advice) return "-";
  // normalize whitespace and newlines to match stored templates
  const normalized = advice.replace(/\s+/g, " ").trim();
  const map: Record<string, string> = {
    "Follow-up is not required": "无需随访",
    "Follow-up ultrasound is recommended at 6 months, 1 year, and 2 years; Follow-up should be discontinued after 2 years in the absence of growth.":
      "建议于6个月、1年及2年进行超声随访；若2年内病灶无增大，应停止随访。",
    "Cholecystectomy is recommended if the patient is fit for, and accepts, surgery;\n MDT discussion may be considered":
      "若患者具备手术指征且可耐受手术，建议行胆囊切除术；可考虑进行多学科团队MDT讨论。",
    "Cholecystectomy is strongly recommended if the patient is fit for, and accepts, surgery":
    "若患者具备手术指征且可耐受手术，强烈建议行胆囊切除术。"
  };

  return map[normalized] || advice;
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
      "医生姓名",
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
      d.doctorName,
      d.doctorId,
      d.age,
      d.polypsNumber,
      d.longDiameter,
      d.shortDiameter,
      getBaseTypeLabel(d.baseType),
      d.probability,
      d.risk_level,
      getMalignantInfo(d.is_worse).label,
      getAdviceLabel(d.advice || ""),
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
const validationInProgress = ref(false);

const validateLongDiameter = (rule: any, value: any, callback: any) => {
  if (value === null || value === undefined) {
    callback(new Error("请输入长径"));
  } else if (
    patientForm.shortDiameter !== null &&
    Number(value) < Number(patientForm.shortDiameter)
  ) {
    callback(new Error("长径必须大于等于短径"));
  } else {
    // 避免循环验证
    if (!validationInProgress.value && patientForm.shortDiameter !== null) {
      validationInProgress.value = true;
      patientFormRef.value?.validateField("shortDiameter", () => {
        validationInProgress.value = false;
      });
    }
    callback();
  }
};

const validateShortDiameter = (rule: any, value: any, callback: any) => {
  if (value === null || value === undefined) {
    callback(new Error("请输入短径"));
  } else if (
    patientForm.longDiameter !== null &&
    Number(value) > Number(patientForm.longDiameter)
  ) {
    callback(new Error("短径必须小于等于长径"));
  } else {
    // 避免循环验证
    if (!validationInProgress.value && patientForm.longDiameter !== null) {
      validationInProgress.value = true;
      patientFormRef.value?.validateField("longDiameter", () => {
        validationInProgress.value = false;
      });
    }
    callback();
  }
};

const formRules = {
  clinicNum: [{ required: true, message: "请输入病历单号", trigger: "blur" }],
  age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
  polypsNum: [{ required: true, message: "请输入息肉数量", trigger: "blur" }],
  longDiameter: [
    { required: true, validator: validateLongDiameter, trigger: "blur" },
    { required: true, validator: validateLongDiameter, trigger: "change" },
  ],
  shortDiameter: [
    { required: true, validator: validateShortDiameter, trigger: "blur" },
    { required: true, validator: validateShortDiameter, trigger: "change" },
  ],
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
  height: 100%; /* 撑满父容器高度 */
  overflow: hidden; /* 防止自身溢出 */
  background: transparent; /* 背景透明，避免双重背景色 */
  padding: 0; /* 移除内边距，统一由 MainLayout 控制 */
}
.query-card {
  margin-bottom: 0px; /* 移除底部外边距，改为 flex-gap 控制间距 */
  border-radius: 8px;
  background-color: #ffffff;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  flex-shrink: 0; /* 防止查询卡片被压缩 */
}

.query-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.search-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f2f5;
}

.search-header .title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  display: flex;
  align-items: center;
}

.search-header .title::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 16px;
  background-color: var(--el-color-primary);
  margin-right: 12px;
  border-radius: 2px;
}

.search-header .actions {
  padding-top: 12px;
  display: flex;
  gap: 12px;
  align-items: center;
}

.range-input-group {
  display: flex;
  align-items: center;
  width: 100%;
}

.range-item {
  width: 100%;
}

.range-separator {
  margin: 0 8px;
  color: #909399;
  flex-shrink: 0;
}

.unit {
  margin-left: 8px;
  color: #909399;
  font-size: 13px;
  flex-shrink: 0;
}

.radio-group-full {
  width: 100%;
  display: flex;
}

:deep(.radio-group-full .el-radio-button__inner) {
  width: 100%;
}

:deep(.radio-group-full .el-radio-button) {
  flex: 1;
}

.advanced-filters {
  background-color: #fcfcfc;
  border-radius: 4px;
  padding: 16px;
  margin-top: 20px;
  border: 1px dashed #e4e7ed;
}

.text-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.records-card {
  /* min-height: 500px; */
  flex: 1; /* 让表格卡片自动填充剩余高度 */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* 隐藏外层溢出 */
  border-radius: 8px;
}
:deep(.el-card__body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 0 20px 20px 20px !important;
}
:deep(.el-table) {
  flex: 1; /* 表格自动填充高度 */
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
:deep(.custom-dialog) {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.12);
}
:deep(.custom-dialog .el-dialog__header) {
  background-color: #f5f7fa;
  margin-right: 0;
  padding: 20px;
  border-bottom: 1px solid #eef0f5;
}
:deep(.custom-dialog .el-dialog__title) {
  font-weight: 600;
  color: #303133;
}
:deep(.custom-dialog .el-dialog__body) {
  padding: 24px;
}
:deep(.custom-dialog .el-dialog__footer) {
  padding: 16px 24px;
  background-color: #f5f7fa;
  border-top: 1px solid #eef0f5;
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
.required-hint {
  text-align: right;
  margin-bottom: 16px;
  font-size: 13px;
  color: #909399;
}
.required-star {
  color: var(--el-color-danger);
  font-weight: bold;
  margin-right: 4px;
}
</style>
