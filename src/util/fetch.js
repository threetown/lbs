import axios from 'axios';
let qs = require('qs');

if (process.env.NODE_ENV == 'development') {
    axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'debug') {
    axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
    axios.defaults.baseURL = 'http://consoleapi.cindata.cn/';
}

// 1. 创建axios实例
const fetch = axios.create({
    timeout: 500000 // 请求超时时间
});

// 2. http request 拦截器
fetch.interceptors.request.use(config => {
    // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    // config.headers['Authorization'] = 'token-XXXX-XXXX-XXX-XXXX';
    config.headers['Content-type'] = config.headers['Content-type'] ? config.headers['Content-type'] : 'application/json'; // 指定资源的MIME类型，默认为：'application/json;charset=UTF-8'
    config.data = config.headers['Content-type'] === 'application/x-www-form-urlencoded' ? qs.stringify(config.data) : config.data;
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.withCredentials = true;
    return config;
}, error => {
    return Promise.reject(error);
});

// 3. respone拦截器
fetch.interceptors.response.use(
    (response) => {
        return response.data;
    }, (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    console.log('没有权限');
                    break;
                case 500:
                    console.log('内部服务器错误!')
                    break;
                case 40301:
                    console.log('response:403, 当前用户无相关操作权限！')
                    break;
                default:
                    console.error('错误信息：' + error.response.status + '-'+ error.response.statusText)
            }
            switch (error.response.data.state) {
                case -1:
                    window.location = 'http://testsso.cindata.cn/sso/login?callbackUrl=http://testlbs.cindata.cn&p=gxdyun';
                    console.log(error.response.data.message)
                    break;
                case -2:
                    console.log(error.response.data.message)
                    break;
                case -3:
                    console.log(error.response.data.message)
                    break;
                default:
                    console.error(error.response.data.message)
            }
        }
        return Promise.reject(error.response.data);
    }
);

export default fetch;
