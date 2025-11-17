<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100"
  >
    <div class="text-center px-6">
      <div class="mb-8">
        <i class="fa-solid fa-ban text-red-500 text-9xl mb-6"></i>
      </div>

      <h1 class="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">Truy cập bị từ chối</h2>
      <p class="text-gray-600 text-lg mb-8 max-w-md mx-auto">
        Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây
        là lỗi.
      </p>

      <div class="flex gap-4 justify-center">
        <router-link to="/">
          <button
            class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
          >
            <i class="fa-solid fa-home"></i>
            <span>Về trang chủ</span>
          </button>
        </router-link>

        <button
          class="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2"
          @click="$router.back()"
        >
          <i class="fa-solid fa-arrow-left"></i>
          <span>Quay lại</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// No additional logic needed
</script>
