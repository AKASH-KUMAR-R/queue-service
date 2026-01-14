import { api } from "./axiosConfig";
import { attachResponseInterceptor } from "./interceptor";

attachResponseInterceptor(api);

export { unauthorizedApi } from "./axiosConfig";

export default api;
