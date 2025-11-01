<template>
  <HeaderPart />
  <NavBar :user-info="userInfo" />

  <div class="min-h-screen bg-gray-50 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-gray-800">Chỉnh sửa thông tin cá nhân</h1>
        <p class="text-gray-600 mt-2">Cập nhật thông tin tài khoản của bạn</p>
      </div>

      <!-- Profile Edit Form Component -->

      <!-- Form chi danh cho edit profile patient -->
      <ProfileEditForm
        :user-info="userInfo"
        :is-submitting="isSubmitting"
        @submit="handleSubmit"
        @cancel="handleCancel"
        @avatar-change="handleAvatarChange"
      />
    </div>
  </div>
  <router-link to="/role-requests">
    <div class="flex justify-center p-3">
      <button
        type="button"
        class="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition bg-blue-500 text-white"
      >
        <i class="fa-solid fa-briefcase"></i>
        Yêu cầu nâng cấp quyền hạn (Đối với nhân viên y tế)
      </button>
    </div>
  </router-link>
  <Toaster position="top-right" />
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';
import { toast, Toaster } from 'vue-sonner';
import HeaderPart from '@/components/HeaderPart.vue';
import NavBar from '@/components/NavBar.vue';
import ProfileEditForm from '@/components/Form/ProfileEditForm.vue';
import { userService } from '@/api/userService';

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

const isSubmitting = ref(false);
const avatarFile = ref(null);

// Handle avatar change from child component
const handleAvatarChange = file => {
  avatarFile.value = file;
};

// Handle form submission
const handleSubmit = async formData => {
  try {
    isSubmitting.value = true;

    // Step 1: Upload avatar if user selected a new one
    let avatarUrl = userInfo.value?.avatar;
    if (avatarFile.value) {
      try {
        const uploadResponse = await userService.uploadAvatar(avatarFile.value);
        if (uploadResponse.success) {
          avatarUrl = uploadResponse.data.avatarUrl;
          toast.success('Upload ảnh thành công!');
        }
      } catch (uploadError) {
        console.error('Avatar upload failed:', uploadError);
        toast.error('Upload ảnh thất bại, nhưng sẽ tiếp tục cập nhật thông tin khác');
      }
    }

    // Step 2: Add avatar URL to form data
    const updateData = {
      ...formData,
      avatar: avatarUrl,
    };
    console.log('Update Data:', updateData);

    // Step 3: Call API to update profile
    const response = await userService.updateUserProfile(updateData);
    if (!response.success) {
      throw new Error(response.message || 'Cập nhật thất bại');
    }

    // Update store with the latest user data from backend (includes virtuals like fullName)
    userStore.setUser(response.data.user);

    toast.success('Cập nhật thông tin thành công!');

    // Redirect back to profile after 1s
    setTimeout(() => {
      router.push('/userProfile');
    }, 1000);
  } catch (error) {
    console.error('Update profile failed:', error);
    const errorMsg = error.response?.data?.message || 'Cập nhật thất bại, vui lòng thử lại';
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
