<template>
  <div
    class="flex items-center justify-center min-h-screen bg-[url('/src/assets/background.avif')] bg-cover p-4 relative"
  >
    <div class="absolute inset-0 bg-black opacity-30"></div>
    <div
      class="relative flex flex-col md:flex-row bg-white rounded-3xl shadow-xl overflow-hidden w-full max-w-5xl"
    >
      <!-- Animated overlay that starts covering the entire form then retracts -->
      <div
        class="absolute top-0 right-0 h-full bg-[#6B8BFF] transition-all ease-in-out duration-1000 pointer-events-none z-10 hidden md:block"
        :class="expanded ? 'md:w-full' : 'md:w-1/2 md:rounded-l-[100px]'"
      ></div>

      <!-- left panel -->

      <div class="relative z-0 flex flex-col justify-center items-center p-10 space-y-4 md:w-1/2">
        <h2 class="text-3xl font-bold mb-4 text-gray-800 p-5">Đăng ký tài khoản</h2>

        <Form
          class="w-full max-w-sm space-y-4"
          :validation-schema="registerFormSchema"
          @submit="handleSubmit"
        >
          <div class="flex justify-between">
            <Field
              name="lastName"
              type="text"
              placeholder="Họ"
              class="w-[48%] px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8BFF]"
            />
            <ErrorMessage name="lastName" class="text-red-500 text-sm mt-1" />
            <Field
              name="firstName"
              type="text"
              placeholder="Tên"
              class="w-[48%] px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8BFF]"
            />
            <ErrorMessage name="firstName" class="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <Field
              name="email"
              type="email"
              placeholder="Email"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8BFF]"
            />
            <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
          </div>
          <div>
            <Field
              name="phone"
              type="tel"
              placeholder="Số điện thoại"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8BFF]"
            />
            <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
          </div>

          <div>
            <label class="m-2" for="dateOfBirth">Ngày sinh</label>
            <Field
              name="dateOfBirth"
              type="date"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8BFF]"
            />
          </div>
          <div>
            <label class="mr-4">Giới tính: </label>
            <Field class="ml-5" name="gender" type="radio" value="male" />
            <label class="p-3">Nam</label>
            <Field class="ml-5" name="gender" type="radio" value="female" />
            <label class="p-3">Nữ</label>
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

          <div class="relative">
            <Field
              name="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Nhập lại mật khẩu"
              class="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#6B8BFF]"
            />
            <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1" />
            <button
              type="button"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              tabindex="-1"
              @click="toggleConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
            </button>
          </div>

          <div class="text-right">
            <a href="#" class="text-sm text-[#6B8BFF] hover:underline">Quên mật khẩu?</a>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-[#6B8BFF] text-white py-3 rounded-lg hover:bg-[#5670d4] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Đang xử lý...' : 'Đăng ký' }}
          </button>

          <div class="flex justify-center space-x-4 mt-2">
            <div id="google-btn" class="w-full flex justify-center"></div>
          </div>
        </Form>
      </div>

      <!-- Right panel -->
      <div
        class="relative z-20 bg-[#6B8BFF] text-white flex flex-col justify-center items-center p-10 md:w-1/2 md:rounded-l-[100px]"
      >
        <img class="w-40" src="../../assets/HealthCare.png" alt="" />
        <h2 class="text-3xl font-bold mb-2">Hello, Welcome!</h2>
        <p class="text-white/80 mb-6">Do you have an account?</p>
        <router-link to="/login">
          <button
            class="border-2 border-white px-6 py-2 rounded-full hover:bg-white hover:text-[#6B8BFF] transition"
          >
            Login
          </button>
        </router-link>
      </div>
    </div>
  </div>

  <Toaster position="top-right" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { authService } from '@/api/authService';
import { Toaster, toast } from 'vue-sonner';

// Animation state
const expanded = ref(true);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

const userStore = useUserStore();

const router = useRouter();

onMounted(() => {
  setTimeout(() => {
    expanded.value = false;
  }, 100);
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Validation schema
const registerFormSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Tên không được để trống')
    .max(50, 'Tên không được vượt quá 50 ký tự'),

  lastName: yup
    .string()
    .required('Họ không được để trống')
    .max(50, 'Họ không được vượt quá 50 ký tự'),

  email: yup.string().required('Email không được để trống').email('Email không hợp lệ'),

  phone: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số'),

  dateOfBirth: yup
    .date()
    .required('Vui lòng chọn ngày sinh')
    .max(new Date(), 'Ngày sinh không được lớn hơn ngày hiện tại'),

  password: yup
    .string()
    .required('Mật khẩu không được để trống')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(/[A-Z]/, 'Mật khẩu phải chứa ít nhất một chữ cái viết hoa')
    .matches(/[a-z]/, 'Mật khẩu phải chứa ít nhất một chữ cái viết thường')
    .matches(/[0-9]/, 'Mật khẩu phải chứa ít nhất một chữ số')
    .matches(/[@$!%*?&]/, 'Mật khẩu phải chứa ít nhất một ký tự đặc biệt'),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
    .required('Vui lòng nhập lại mật khẩu'),

  gender: yup.string().required('Vui lòng chọn giới tính'),
});

// Handle form submission
const handleSubmit = async values => {
  try {
    isSubmitting.value = true;
    errorMessage.value = '';

    // Prepare data for API (remove confirmPassword, not needed by backend)
    // eslint-disable-next-line no-unused-vars
    const { confirmPassword, ...userData } = values;

    // Call register API
    const response = await authService.register(userData);

    if (response && response.data) {
      console.log('Registration successful:', response);
      const userStore = useUserStore();
      userStore.email = values.email;
      router.push('/login');
    }
  } catch (error) {
    console.error('Registration failed:', error);

    // Handle error
    if (error.response?.data?.message) {
      errorMessage.value = error.response.data.message;
    } else {
      errorMessage.value = 'Đăng ký thất bại. Vui lòng thử lại.' + `${error.message}`;
    }

    // Show error to user
    alert(errorMessage.value);
  } finally {
    isSubmitting.value = false;
  }
};

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
      } else if (user.role === 'doctor') {
        router.push('/doctor/dashboard');
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
</script>
