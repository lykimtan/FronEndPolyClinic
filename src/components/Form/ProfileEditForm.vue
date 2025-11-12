<template>
  <Form
    class="bg-white rounded-2xl shadow-lg p-8"
    enctype="multipart/form-data"
    :validation-schema="validationSchema"
    :initial-values="initialValues"
    @submit="handleFormSubmit"
  >
    <!-- Avatar Section -->
    <div class="flex flex-col items-center mb-8">
      <div class="relative">
        <img
          :src="previewAvatar || avatarUrl"
          alt="Avatar"
          class="w-32 h-32 rounded-full object-cover border-4 border-sky-500 shadow-lg"
        />
        <label
          class="absolute bottom-0 right-0 bg-sky-500 text-white rounded-full p-2 cursor-pointer hover:bg-sky-600 transition shadow-md"
        >
          <i class="fa-solid fa-camera"></i>
          <input type="file" class="hidden" accept="image/*" @change="onAvatarChange" />
        </label>
      </div>
      <p class="text-sm text-gray-500 mt-2">Click vào icon camera để thay đổi ảnh đại diện</p>
    </div>

    <!-- Personal Information -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <i class="fa-solid fa-user mr-2 text-sky-500"></i>
        Thông tin cá nhân
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Họ</label>
          <Field
            name="lastName"
            type="text"
            placeholder="Nhập họ"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <ErrorMessage name="lastName" class="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tên</label>
          <Field
            name="firstName"
            type="text"
            placeholder="Nhập tên"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <ErrorMessage name="firstName" class="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Field
            name="email"
            type="email"
            placeholder="Email"
            disabled
            class="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 cursor-not-allowed"
          />
          <p class="text-xs text-gray-500 mt-1">Email không thể thay đổi</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <Field
            name="phone"
            type="tel"
            placeholder="Số điện thoại"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <ErrorMessage name="phone" class="text-red-500 text-sm mt-1" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
          <Field
            name="address"
            type="text"
            placeholder="Nhập địa chỉ"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <ErrorMessage name="address" class="text-red-500 text-sm mt-1" />
        </div>
      </div>
    </div>

    <!-- Medical Information (For Patients) -->
    <div v-if="userRole === 'patient'" class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <i class="fa-solid fa-notes-medical mr-2 text-sky-500"></i>
        Thông tin y tế
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
          <Field
            name="dateOfBirth"
            type="date"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <ErrorMessage name="dateOfBirth" class="text-red-500 text-sm mt-1" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          <Field
            name="gender"
            as="select"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </Field>
          <ErrorMessage name="gender" class="text-red-500 text-sm mt-1" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Dị ứng (nếu có)</label>
          <Field
            name="allergies"
            type="text"
            placeholder="Ví dụ: Penicillin, Hải sản... (cách nhau bằng dấu phẩy)"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">Tiền sử bệnh (nếu có)</label>
          <Field
            name="medicalHistory"
            as="textarea"
            rows="3"
            placeholder="Mô tả tiền sử bệnh của bạn..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
    </div>

    <!-- Emergency Contact -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <i class="fa-solid fa-phone mr-2 text-sky-500"></i>
        Liên hệ khẩn cấp
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tên người liên hệ</label>
          <Field
            name="emergencyContact.name"
            type="text"
            placeholder="Họ tên"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <Field
            name="emergencyContact.phone"
            type="tel"
            placeholder="Số điện thoại"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Mối quan hệ</label>
          <Field
            name="emergencyContact.relationship"
            type="text"
            placeholder="Ví dụ: Bố, Mẹ, Vợ..."
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-end gap-4 mt-8">
      <button
        type="button"
        class="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
        @click="$emit('cancel')"
      >
        <i class="fa-solid fa-xmark mr-2"></i>
        Hủy
      </button>
      <button
        type="submit"
        :disabled="isSubmitting"
        class="px-6 py-3 rounded-lg bg-sky-500 text-white font-medium hover:bg-sky-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <i class="fa-solid fa-floppy-disk mr-2"></i>
        {{ isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
      </button>
    </div>
  </Form>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toast } from 'vue-sonner';

// Props
const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(['submit', 'cancel', 'avatar-change']);

// Local state
const previewAvatar = ref(null);
const selectedAvatarFile = ref(null);

// Computed
const userRole = computed(() => props.userInfo?.role);

const avatarUrl = computed(() => {
  const avatar = props.userInfo?.avatar;
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
});

// Validation schema
const validationSchema = yup.object({
  firstName: yup.string().required('Tên không được để trống').max(50, 'Tên tối đa 50 ký tự'),
  lastName: yup.string().required('Họ không được để trống').max(50, 'Họ tối đa 50 ký tự'),
  phone: yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(/^[0-9]{10}$/, 'Số điện thoại phải có 10 chữ số'),
  address: yup.string(),
  dateOfBirth: yup.date(),
  gender: yup.string().oneOf(['male', 'female', 'other'], 'Giới tính không hợp lệ'),
  allergies: yup.string(),
  medicalHistory: yup.string(),
});

// Initial form values
const initialValues = computed(() => ({
  firstName: props.userInfo?.firstName || '',
  lastName: props.userInfo?.lastName || '',
  email: props.userInfo?.email || '',
  phone: props.userInfo?.phone || '',
  address: props.userInfo?.address || '',
  dateOfBirth: props.userInfo?.dateOfBirth ? props.userInfo.dateOfBirth.split('T')[0] : '',
  gender: props.userInfo?.gender || 'male',
  allergies: props.userInfo?.allergies?.join(', ') || '',
  medicalHistory: props.userInfo?.medicalHistory?.join(', ') || '',
  emergencyContact: {
    name: props.userInfo?.emergencyContact?.name || '',
    phone: props.userInfo?.emergencyContact?.phone || '',
    relationship: props.userInfo?.emergencyContact?.relationship || '',
  },
}));

// Handle avatar change
const onAvatarChange = event => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh không được vượt quá 5MB');
      return;
    }

    selectedAvatarFile.value = file;
    const reader = new FileReader();
    reader.onload = e => {
      previewAvatar.value = e.target.result;
    };
    reader.readAsDataURL(file);

    // Emit avatar file to parent
    emit('avatar-change', file);
  }
};

// Handle form submission
const handleFormSubmit = values => {
  // Prepare data
  const formData = {
    firstName: values.firstName,
    lastName: values.lastName,
    phone: values.phone,
    address: values.address,
    dateOfBirth: values.dateOfBirth,
    gender: values.gender,
    allergies: values.allergies ? values.allergies.split(',').map(a => a.trim()) : [],
    medicalHistory: values.medicalHistory
      ? values.medicalHistory.split(',').map(m => m.trim())
      : [],
    emergencyContact: values.emergencyContact,
  };

  emit('submit', formData);
};
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
