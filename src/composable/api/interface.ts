import axios from "axios";
const instance = axios.create({
  baseURL: "/api",
  timeout: 5000,
  withCredentials: true,
  headers: { "X-Custom-Header": "foobar" },
});

instance.interceptors.response.use(
  (res) => {
    //   if (res && res.data) {
    //     if (res.data.success) {
    //       if (res.data.data) {
    //         return res.data.data;
    //       } else {
    //         return res.data.success;
    //       }
    //     } else {
    //       return Promise.reject(res.data.message);
    //     }
    //   } else {
    //     return Promise.reject("请求错误");
    //   }
    // },
    if (res && res.data) {
      // 成功响应
      if (res.data.success === true) {
        return res.data.data !== undefined ? res.data.data : res.data;
      }

      // 失败响应 (success: false)
      if (res.data.success === false) {
        // ✅ 患者已存在 (code: 3) - 不阻断，返回数据让业务继续
        if (res.data.code === 3) {
          console.log("患者已存在，继续流程");
          return res.data; // 直接返回，不进入 catch
        }

        // ❌ 其他错误 (code: 4 等) - 阻断，进入 catch
        return Promise.reject({
          message: res.data.message || "操作失败",
          code: res.data.code,
          data: res.data,
        });
      }

      // 没有 success 字段的接口
      return res.data;
    }
    return Promise.reject("请求错误");
  },
  (err) => {
    return Promise.reject(err.message);
  },
);

export default instance;