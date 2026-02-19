import axios from "axios";
const instance = axios.create({
  baseURL: "/api",
  timeout: 5000,
  withCredentials: true,
  headers: { "X-Custom-Header": "foobar" },
});

instance.interceptors.response.use(
  (res) => {
    if (res && res.data) {
      if (res.data.success) {
        if (res.data.data) {
          return res.data.data;
        } else {
          return res.data.success;
        }
      } else {
        return Promise.reject(res.data.message);
      }
    } else {
      return Promise.reject("请求错误");
    }
  },
  (err) => {
    return Promise.reject(err.message);
  },
);

export default instance;
