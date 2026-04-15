export interface FilingConfig {
  // Example: "京ICP备12345678号-1"
  icpNumber: string;
  // MIIT filing portal homepage
  icpLink: string;
  // Example: "京公网安备11010502012345号"
  psbNumber: string;
  // Numeric code used by beian.gov.cn query URL, e.g. 11010502012345
  psbRecordCode: string;
  // Fallback URL if psbRecordCode is empty
  psbLink: string;
}

export const filingConfig: FilingConfig = {
  // TODO: Replace once ICP approval is complete
  icpNumber: "ICP备案xxxxxxxxx",
  icpLink: "https://beian.miit.gov.cn/",
  psbNumber: "陕公网安备61011302002379号",
  psbRecordCode: "61011302002379",
  psbLink: "https://beian.mps.gov.cn/",
};

export const filingPendingText = "备案信息审核中";
