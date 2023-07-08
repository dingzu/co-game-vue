import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from '@/api/http'
import store from './store'

const app = createApp(App);
app.use(store).use(router).mount('#app');
app.config.globalProperties.$axios = axios
