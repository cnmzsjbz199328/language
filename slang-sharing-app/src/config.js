// src/config.js
const localApiHost = 'http://localhost/slang-sharing-backend/api';
const remoteApiHost = process.env.REACT_APP_API_HOST;

const config = {
    apiHost: remoteApiHost || localApiHost,
};

console.log('API Host:', config.apiHost); // 检查当前使用的 apiHost

export default config;