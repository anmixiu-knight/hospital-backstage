<template>
  <footer class="filing-footer" aria-label="备案信息">
    <template v-if="hasAnyRecord">
      <a
        v-if="filingConfig.icpNumber"
        class="filing-link"
        :href="filingConfig.icpLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ filingConfig.icpNumber }}
      </a>
      <span v-if="showSeparator" class="separator">|</span>
      <a
        v-if="filingConfig.psbNumber"
        class="filing-link"
        :href="filingConfig.psbLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img class="psb-icon" src="/lianwangbeian.png" alt="公安备案图标" />
        {{ filingConfig.psbNumber }}
      </a>
    </template>
    <span v-else class="filing-pending">{{ filingPendingText }}</span>
  </footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { filingConfig, filingPendingText } from "@/config/filing";

const hasAnyRecord = computed(
  () => Boolean(filingConfig.icpNumber) || Boolean(filingConfig.psbNumber),
);

const showSeparator = computed(
  () => Boolean(filingConfig.icpNumber) && Boolean(filingConfig.psbNumber),
);

</script>

<style scoped>
.filing-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 20px;
  font-size: 12px;
  line-height: 1.6;
  color: #8c8c8c;
  text-align: center;
}

.filing-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #8c8c8c;
  text-decoration: none;
  transition: color 0.2s ease;
}

.psb-icon {
  width: 14px;
  height: 14px;
  object-fit: contain;
}

.filing-link:hover {
  color: #409eff;
}

.separator {
  color: #d0d0d0;
}

.filing-pending {
  color: #a0a0a0;
}
</style>
