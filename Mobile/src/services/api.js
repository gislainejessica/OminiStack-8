import axios from 'axios';
// "http://localhost:7777"  'http://192.168.15.8:7777

const api = axios.create({ 
    baseURL: 'http://192.168.15.8:7777' 
});

export default api;