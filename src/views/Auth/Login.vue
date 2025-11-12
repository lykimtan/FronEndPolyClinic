<template>
  <div
    class="flex items-center justify-center min-h-screen bg-[url('/src/assets/background.avif')] bg-cover p-4 relative"
  >
    <div class="absolute inset-0 bg-black opacity-30"></div>
    <div
      class="relative flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl"
    >
      <div
        class="absolute top-0 left-0 h-full bg-[#6B8BFF] transition-all ease-in-out duration-1000 pointer-events-none z-10 hidden md:block"
        :class="expanded ? 'md:w-full' : 'md:w-1/2 md:rounded-r-[100px]'"
      ></div>
      <!-- Left panel -->
      <div
        class="relative z-20 bg-[#6B8BFF] text-white flex flex-col justify-center items-center p-10 md:w-1/2 rounded-r-[100px]"
      >
        <h2 class="text-3xl font-bold mb-2">Hello, Welcome Back!</h2>
        <p class="text-white/80 mb-6">Don't have an account?</p>
        <router-link to="/register">
          <button
            class="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-[#6B8BFF] transition"
          >
            Register
          </button>
        </router-link>
      </div>

      <!-- Right panel -->
      <div class="relative z-0 flex flex-col justify-center items-center p-10 space-y-4 md:w-1/2">
        <h2 class="text-3xl font-bold mb-4 text-gray-800">Login</h2>

        <Form
          class="w-full max-w-sm space-y-4"
          :validation-schema="loginSchema"
          @submit="handleSubmit"
        >
          <div>
            <Field
              v-model="email"
              name="email"
              type="email"
              placeholder="Email"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8BFF]"
            />
          </div>
          <div class="relative">
            <Field
              name="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mật khẩu"
              class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8BFF]"
            />
            <ErrorMessage name="password" class="text-red-500 text-sm mt-1" />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabindex="-1"
              @click="togglePassword"
            >
              <i :class="showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>

          <div class="text-right">
            <a href="#" class="text-sm text-[#6B8BFF] hover:underline">Forgot Password?</a>
          </div>

          <button
            class="w-full bg-[#6B8BFF] text-white py-3 rounded-lg hover:bg-[#5670d4] transition"
            type="submit"
          >
            Login
          </button>

          <div class="text-center text-gray-500 text-sm mt-4">or login with social platforms</div>

          <div class="flex justify-center space-x-4 mt-2">
            <div id="google-btn" class="w-full flex justify-center"></div>
          </div>
        </Form>
      </div>
    </div>
  </div>
  <Toaster position="top-right" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as yup from 'yup';
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useUserStore } from '@/stores/userStore';
import { Toaster, toast } from 'vue-sonner';
import router from '@/router/index.js';
import { authService } from '@/api/authService';

const email = ref('');
const showPassword = ref(false);

const userStore = useUserStore();

// Start expanded, then retract after 1.5s
const expanded = ref(true);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

//xu ly dang nhap

const handleGoogleLogin = async idToken => {
  try {
    const response = await authService.googleLogin({ idToken });

    if (response?.success && response?.data?.user) {
      const user = response.data.user;
      toast.success(`Đăng nhập Google thành công! Chào mừng ${user.firstName || ''}!`);
      userStore.setUser(user);

      // Redirect based on user role
      if (user.role === 'staff') {
        router.push('/staff/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } else {
      toast.error(response?.message || 'Đăng nhập Google thất bại!');
    }
  } catch (error) {
    console.error('Google login failed:', error);
    toast.error(error.response?.data?.message || 'Lỗi đăng nhập Google');
  }
};

onMounted(() => {
  // Render nút Google
  /* global google */
  // Debug: print client id and origin from module context (cannot use import.meta in browser console)
  try {
    console.log('GSI client id (from module):', import.meta.env.VITE_GOOGLE_CLIENT_ID);

    console.log('Page origin:', window.location.origin);
  } catch (e) {
    console.warn('Unable to read import.meta.env here', e);
  }
  if (window.google) {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: response => {
        const idToken = response.credential;
        handleGoogleLogin(idToken);
      },
    });

    google.accounts.id.renderButton(document.getElementById('google-btn'), {
      theme: 'outline',
      size: 'large',
      width: 250,
    });
  }
});

const loginSchema = yup.object({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
});

const handleSubmit = async credential => {
  try {
    const response = await authService.login(credential);

    // Backend returns: { success, message, data: { user } }
    if (response?.success && response?.data?.user) {
      const user = response.data.user;
      toast.success(`Đăng nhập thành công! Chào mừng ${user.fullName || user.firstName || ''}!`);

      // Lưu thông tin người dùng vào store
      userStore.setUser(user);

      // Redirect based on user role
      if (user.role === 'staff') {
        router.push('/staff/dashboard');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } else {
      toast.error(response?.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin.');
    }
  } catch (error) {
    console.error('Login failed:', error);

    // Extract backend error message if available
    const errorMsg =
      error.response?.data?.message || error.message || 'Đăng nhập thất bại, vui lòng thử lại';
    toast.error(errorMsg);
  }
};

onMounted(() => {
  if (userStore.email) {
    toast.success('Bạn đã đăng ký tài khoản thành công, ' + userStore.email + '!');
  }
  email.value = userStore.email || '';
  setTimeout(() => {
    expanded.value = false;
  }, 100);
});
</script>
