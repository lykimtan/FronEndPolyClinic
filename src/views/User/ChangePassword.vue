<template>
  <HeaderPart />
  <NavBar :user-info="userInfo" />
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4"
        >
          <i class="fa-solid fa-key text-white text-2xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-900">Đổi Mật Khẩu</h1>
        <p class="mt-2 text-gray-600">Cập nhật mật khẩu để bảo mật tài khoản của bạn</p>
      </div>

      <!-- Change Password Form -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <Form v-slot="{ meta }" :validation-schema="passwordSchema" @submit="handleSubmit">
          <!-- Current Password -->
          <div class="mb-6">
            <label for="currentPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-lock mr-2 text-gray-500"></i>
              Mật khẩu hiện tại
            </label>
            <div class="relative">
              <Field
                id="currentPassword"
                name="currentPassword"
                :type="showCurrentPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Nhập mật khẩu hiện tại"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showCurrentPassword = !showCurrentPassword"
              >
                <i :class="showCurrentPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <ErrorMessage name="currentPassword" class="text-red-500 text-sm mt-1 block" />
          </div>

          <!-- New Password -->
          <div class="mb-6">
            <label for="newPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-lock mr-2 text-gray-500"></i>
              Mật khẩu mới
            </label>
            <div class="relative">
              <Field
                id="newPassword"
                v-model="newPasswordValue"
                name="newPassword"
                :type="showNewPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Nhập mật khẩu mới"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showNewPassword = !showNewPassword"
              >
                <i :class="showNewPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <ErrorMessage name="newPassword" class="text-red-500 text-sm mt-1 block" />

            <!-- Password Strength Indicator -->
            <div v-if="passwordStrength" class="mt-2">
              <div class="flex items-center gap-2">
                <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    :class="['h-full transition-all duration-300', passwordStrength.color]"
                    :style="{ width: passwordStrength.width }"
                  ></div>
                </div>
                <span :class="['text-xs font-medium', passwordStrength.textColor]">
                  {{ passwordStrength.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- Confirm New Password -->
          <div class="mb-6">
            <label for="confirmPassword" class="block text-sm font-semibold text-gray-700 mb-2">
              <i class="fa-solid fa-lock mr-2 text-gray-500"></i>
              Xác nhận mật khẩu mới
            </label>
            <div class="relative">
              <Field
                id="confirmPassword"
                name="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Nhập lại mật khẩu mới"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                @click="showConfirmPassword = !showConfirmPassword"
              >
                <i :class="showConfirmPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'"></i>
              </button>
            </div>
            <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1 block" />
          </div>

          <!-- Password Requirements -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 class="text-sm font-semibold text-blue-900 mb-2">
              <i class="fa-solid fa-circle-info mr-2"></i>
              Yêu cầu mật khẩu:
            </h3>
            <ul class="text-sm text-blue-800 space-y-1">
              <li class="flex items-start">
                <i class="fa-solid fa-check-circle text-green-500 mr-2 mt-0.5"></i>
                <span>Ít nhất 8 ký tự</span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-check-circle text-green-500 mr-2 mt-0.5"></i>
                <span>Bao gồm chữ hoa, chữ thường và số</span>
              </li>
              <li class="flex items-start">
                <i class="fa-solid fa-check-circle text-green-500 mr-2 mt-0.5"></i>
                <span>Có ít nhất một ký tự đặc biệt (@$!%*?&)</span>
              </li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button
              type="button"
              class="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              @click="handleCancel"
            >
              <i class="fa-solid fa-xmark mr-2"></i>
              Hủy
            </button>
            <button
              type="submit"
              :disabled="!meta.valid || isSubmitting"
              class="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              <i class="fa-solid fa-check mr-2"></i>
              {{ isSubmitting ? 'Đang xử lý...' : 'Đổi mật khẩu' }}
            </button>
          </div>
        </Form>
      </div>

      <!-- Security Tips -->
      <div class="mt-8 bg-white rounded-xl shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          <i class="fa-solid fa-shield-halved text-indigo-600 mr-2"></i>
          Mẹo bảo mật
        </h3>
        <ul class="space-y-3 text-sm text-gray-600">
          <li class="flex items-start">
            <i class="fa-solid fa-angle-right text-indigo-600 mr-3 mt-1"></i>
            <span>Không sử dụng mật khẩu giống với các tài khoản khác</span>
          </li>
          <li class="flex items-start">
            <i class="fa-solid fa-angle-right text-indigo-600 mr-3 mt-1"></i>
            <span>Thay đổi mật khẩu định kỳ để tăng cường bảo mật</span>
          </li>
          <li class="flex items-start">
            <i class="fa-solid fa-angle-right text-indigo-600 mr-3 mt-1"></i>
            <span>Không chia sẻ mật khẩu với bất kỳ ai</span>
          </li>
          <li class="flex items-start">
            <i class="fa-solid fa-angle-right text-indigo-600 mr-3 mt-1"></i>
            <span>Sử dụng trình quản lý mật khẩu để lưu trữ an toàn</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  <Toaster position="top-right" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toast, Toaster } from 'vue-sonner';
import { useUserStore } from '@/stores/userStore';
import { userService } from '@/api/userService';
import HeaderPart from '@/components/HeaderPart.vue';
import NavBar from '@/components/NavBar.vue';

const router = useRouter();
const userStore = useUserStore();
const userInfo = computed(() => userStore.getUserInfo);

// Auth guard - redirect if not logged in
watch(
  userInfo,
  newValue => {
    if (!newValue || !newValue.id) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      router.push('/login');
    }
  },
  { immediate: true }
);

// Form state
const isSubmitting = ref(false);
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const newPasswordValue = ref('');

// Validation schema
const passwordSchema = yup.object({
  currentPassword: yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Mật khẩu phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
    )
    .notOneOf([yup.ref('currentPassword')], 'Mật khẩu mới phải khác mật khẩu hiện tại'),
  confirmPassword: yup
    .string()
    .required('Vui lòng xác nhận mật khẩu mới')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp'),
});

// Password strength calculator
const calculatePasswordStrength = password => {
  if (!password) return null;

  let strength = 0;
  const checks = [
    password.length >= 8, // Length
    password.length >= 12, // Good length
    /[a-z]/.test(password), // Lowercase
    /[A-Z]/.test(password), // Uppercase
    /\d/.test(password), // Numbers
    /[@$!%*?&]/.test(password), // Special chars
    password.length >= 16, // Excellent length
  ];

  strength = checks.filter(Boolean).length;

  if (strength <= 2) {
    return {
      label: 'Yếu',
      width: '25%',
      color: 'bg-red-500',
      textColor: 'text-red-600',
    };
  } else if (strength <= 4) {
    return {
      label: 'Trung bình',
      width: '50%',
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    };
  } else if (strength <= 5) {
    return {
      label: 'Tốt',
      width: '75%',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    };
  } else {
    return {
      label: 'Mạnh',
      width: '100%',
      color: 'bg-green-500',
      textColor: 'text-green-600',
    };
  }
};

const passwordStrength = computed(() => calculatePasswordStrength(newPasswordValue.value));

// Watch for new password changes
watch(
  () => newPasswordValue.value,
  () => {
    // This will trigger strength calculation
  }
);

// Handle form submission
const handleSubmit = async values => {
  try {
    isSubmitting.value = true;

    const response = await userService.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    if (response.success) {
      toast.success('Đổi mật khẩu thành công!');

      // Redirect to profile after 1.5s
      setTimeout(() => {
        router.push('/userProfile');
      }, 1500);
    } else {
      throw new Error(response.message || 'Đổi mật khẩu thất bại');
    }
  } catch (error) {
    console.error('Change password error:', error);
    const errorMsg =
      error.response?.data?.message || error.message || 'Đổi mật khẩu thất bại, vui lòng thử lại';
    toast.error(errorMsg);
  } finally {
    isSubmitting.value = false;
  }
};

// Handle cancel
const handleCancel = () => {
  router.push('/userProfile');
};
</script>

<style scoped>
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slideIn {
  animation: slideIn 0.5s ease-out;
}
</style>
