import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@vue/runtime-core'
import { AxiosInstance } from "axios";

const app = createApp(App);
app.use(router).mount('#app');

declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $axios: AxiosInstance;
    }
}