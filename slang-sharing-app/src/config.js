// src/config.js
//const localApiHost = 'http://localhost/slang-sharing-backend/api';localApiHost || 
const remoteApiHost = process.env.REACT_APP_API_HOST;

const config = {
    apiHost: remoteApiHost,
};

console.log('API Host:', config.apiHost); // 检查当前使用的 apiHost

export default config;