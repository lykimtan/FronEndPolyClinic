<template>
  <HeaderPart />
  <NavBar />

  <Form
    class="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 w-[50%] mx-auto mb-20"
    enctype="multipart/form-data"
    :validation-schema="validationSchema"
    @submit="handleSubmit"
  >
    <div class="max-w-5xl mx-auto mt-10 mb-20">
      <h1 class="text-3xl font-bold mb-6 text-center">Tạo yêu cầu cấp quyền</h1>
    </div>
    <!-- Select role -->
    <div>
      <label class="block text-base font-semibold text-gray-700 mb-2">Chọn quyền</label>
      <Field
        v-model="selectedRole"
        name="role"
        as="select"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-400"
      >
        <option value="">-- Chọn quyền --</option>
        <option value="doctor">Bác sĩ</option>
        <option value="staff">Nhân viên y tế</option>
        <option value="admin">Quản trị viên</option>
      </Field>
      <ErrorMessage name="role" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Specializations (only show for doctor) -->
    <div v-if="selectedRole === 'doctor'">
      <!-- Specializations selection -->
      <div>
        <label class="block text-base font-semibold text-gray-700 mb-2">Chọn chuyên khoa</label>
        <Field
          name="specializationIds"
          as="select"
          multiple
          class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-400 h-44 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          <option class="py-2 px-2 hover:bg-gray-100 cursor-pointer" value="cardiology">
            Tim mạch
          </option>
          <option class="py-2 px-2 hover:bg-gray-100 cursor-pointer" value="dermatology">
            Da liễu
          </option>
          <option class="py-2 px-2 hover:bg-gray-100 cursor-pointer" value="neurology">
            Thần kinh
          </option>
          <option class="py-2 px-2 hover:bg-gray-100 cursor-pointer" value="pediatrics">
            Nhi khoa
          </option>
          <option class="py-2 px-2 hover:bg-gray-100 cursor-pointer" value="psychiatry">
            Tâm thần học
          </option>
          <option class="py-2 px-2 hover:bg-gray-100 cursor-pointer" value="radiology">
            Chẩn đoán hình ảnh
          </option>
          <option class="py-2 px-2 hover:bg-gray-100 cursor-pointer" value="surgery">
            Phẫu thuật
          </option>
        </Field>
        <ErrorMessage name="specializationIds" class="text-red-500 text-sm mt-1" />
      </div>
    </div>

    <!-- License number -->
    <div>
      <label class="block text-base font-semibold text-gray-700 mb-2">Số giấy phép hành nghề</label>
      <Field
        name="licenseNumber"
        type="text"
        placeholder="Nhập số giấy phép hành nghề"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all hover:border-gray-400"
      />
      <ErrorMessage name="licenseNumber" class="text-red-500 text-sm mt-1" />
    </div>

    <!-- Upload file -->
    <div>
      <label
        class="flex items-center gap-3 px-4 py-3 bg-sky-500 text-white rounded-xl cursor-pointer hover:bg-sky-600 active:scale-[.98] transition-all shadow-md w-fit"
      >
        <i class="fa-solid fa-upload"></i>
        <span>Upload giấy phép (Ảnh)</span>
        <input type="file" class="hidden" accept="image/*" @change="handleFileChange" />
      </label>

      <!-- Hiển thị tên file nếu có -->
      <p v-if="selectedFileName" class="text-sm text-gray-600 mt-2">
        <i class="fa-solid fa-file-image mr-1 text-sky-500"></i> {{ selectedFileName }}
      </p>
    </div>

    <!-- Submit button -->
    <div class="pt-4">
      <button
        type="submit"
        class="w-full py-3 rounded-xl bg-sky-600 text-white text-lg font-semibold tracking-wide hover:bg-sky-700 active:scale-[.98] transition-all shadow-lg"
      >
        Gửi yêu cầu nâng cấp quyền
      </button>
    </div>
  </Form>
</template>
<script setup>
import { ref, computed, watch } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { toast } from 'vue-sonner';
import NavBar from '@/components/NavBar.vue';
import HeaderPart from '@/components/HeaderPart.vue';

const selectedRole = ref('');

const validationSchema = yup.object({
  role: yup.string().required('Vui lòng chọn quyền yêu cầu'),
  specializationIds: yup.array().when('role', {
    is: 'doctor',
    then: yup
      .array()
      .min(1, 'Vui lòng chọn ít nhất một chuyên khoa')
      .required('Vui lòng chọn chuyên khoa'),
    otherwise: yup.array().notRequired(),
  }),
  licenseNumber: yup.string().when('role', {
    is: 'doctor',
    then: yup.string().required('Vui lòng nhập số giấy phép hành nghề'),
    otherwise: yup.string().notRequired(),
  }),
});
</script>
