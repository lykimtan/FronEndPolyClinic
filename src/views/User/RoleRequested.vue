<template>
  <Form
    class="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-gray-100 md:w-[50%] mx-auto mb-20"
    enctype="multipart/form-data"
    :validation-schema="validationSchema"
    :is-submitting="isSubmitting"
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
        name="requestedRole"
        as="select"
        class="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-400"
      >
        <option value="">-- Chọn quyền --</option>
        <option value="doctor">Bác sĩ</option>
        <option value="staff">Nhân viên y tế</option>
        <option value="admin">Quản trị viên</option>
      </Field>
      <ErrorMessage name="requestedRole" class="text-red-500 text-sm mt-1" />
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
          <option
            v-for="spec in specializations"
            :key="spec._id || spec.id"
            :value="spec._id || spec.id"
            class="py-2 px-2 hover:bg-gray-100 cursor-pointer"
          >
            {{ spec.name }}
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
      <img
        v-if="previewDocument"
        :src="previewDocument"
        alt="Document Preview"
        class="w-200 object-cover border-4 border-sky-500 shadow-lg justify-center mt-4 rounded-xl"
      />
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
  <Toaster position="top-right" />
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import router from '@/router';
import * as yup from 'yup';
import { toast, Toaster } from 'vue-sonner';
import { useUserStore } from '@/stores/userStore';
import roleRequestService from '@/api/roleRequestService';
import { useSpecializationStore } from '@/stores/specializationStore';

const userStore = useUserStore();
const userInfo = computed(() => userStore.getUserInfo);
const storeSpecialization = useSpecializationStore();

const specializations = computed(() => storeSpecialization.getAll);

const selectedRole = ref('');
const isSubmitting = ref(false);
const selectedFile = ref(null);
const previewDocument = ref(null);

onMounted(async () => {
  // fetch and populate specializations into the store when HomeView mounts
  await storeSpecialization.fetchSpecializations();
  console.log('Specializations fetched in RoleRequest view: ', storeSpecialization.getAll);
});

// Use lowercase `requestedRole` to match the Field name in the template
const validationSchema = yup.object({
  requestedRole: yup.string().required('Vui lòng chọn quyền yêu cầu'),
  specializationIds: yup.array().when('requestedRole', {
    is: val => val === 'doctor',
    then: () => yup.array().min(1, 'Vui lòng chọn ít nhất một chuyên khoa').required(),
    otherwise: () => yup.array().notRequired(),
  }),
  licenseNumber: yup.string().when('requestedRole', {
    is: 'doctor',
    then: () => yup.string().required('Vui lòng nhập số giấy phép'),
    otherwise: () => yup.string().notRequired(),
  }),
});

const handleFileChange = event => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    const reader = new FileReader();
    reader.onload = e => {
      previewDocument.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = async values => {
  console.log('Form Values: ', values);
  try {
    isSubmitting.value = true;

    // prepare documentUrl in outer scope so it's always defined
    let documentUrl = null;

    if (selectedFile.value) {
      try {
        const uploadResponse = await roleRequestService.uploadDocument(selectedFile.value);
        // support multiple possible response shapes
        const fileUrl =
          uploadResponse?.data?.documentUrl || uploadResponse?.documentUrl || uploadResponse?.data;
        if (fileUrl) {
          documentUrl = fileUrl;
          toast.success('Uploaded proof document successfully');
        } else if (uploadResponse?.success === false) {
          throw new Error(uploadResponse?.message || 'Upload failed');
        } else {
          // no explicit url returned — just warn
          console.warn('Upload response missing file url:', uploadResponse);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload proof document');
        // continue — you may choose to return here to abort submission
      }
    }

    const valuesToSubmit = {
      ...values,
      documentProof: documentUrl || null,
      // include current user's id so backend knows who requested the role
      userId: userInfo?.value?.id ?? null,
    };
    console.log('uploaded Data: ', valuesToSubmit);

    // call Api to submit role request
    const response = await roleRequestService.submitRoleRequest(valuesToSubmit);
    // accept response shapes that either include a success flag or not
    if (response?.success === false) {
      throw new Error(response?.message || 'Submit failed');
    }

    toast.success('Yêu cầu nâng cấp quyền đã được gửi thành công!');
    // reset form state
    setTimeout(() => {
      router.push('/userProfile');
    }, 1000);
  } catch (err) {
    console.error('Submit error:', err);
    toast.error(err?.message || 'Gửi yêu cầu nâng cấp quyền thất bại. Vui lòng thử lại.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
