import { createApp } from 'vue';
import Antd, {message} from 'ant-design-vue';
import App from './App.vue'
import 'ant-design-vue/dist/antd.css';
import axios from 'axios'
const app = createApp(App);

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    message.error(error.message);
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    message.error(error.message);
    console.log('response-error',error)
    // 对响应错误做点什么
    return Promise.reject(error);
});

app.config.globalProperties.$appHost = window.location.hostname+':'+'8088';
/* 会自动注册 Button 下的子组件, 例如 Button.Group */
app.use(Antd)
app.mount('#app');

