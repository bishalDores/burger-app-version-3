import axios from 'axios';

const instance = axios.create({
   baseURL: 'https://burger-app-2a5d9.firebaseio.com/'
});

export default instance;