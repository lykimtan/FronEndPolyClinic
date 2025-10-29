import { createApp } from 'vue';
import { createPinia } from 'pinia';
import router from './router/index.js';
import '@fortawesome/fontawesome-free/css/all.css';
import 'vue-sonner/style.css'; // Import vue-sonner styles

import './style/index.css';
import App from './App.vue';
import { useUserStore } from './stores/userStore';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);

// Restore user from localStorage after Pinia is initialized
const userStore = useUserStore();
userStore.loadUser();

app.mount('#app');
