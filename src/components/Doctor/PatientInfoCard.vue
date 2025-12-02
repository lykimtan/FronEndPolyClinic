<template>
  <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
    <!-- Header Background -->
    <div class="h-24 bg-gradient-to-r from-blue-500 to-cyan-400"></div>

    <!-- Patient Avatar & Name -->
    <div class="px-6 pb-6">
      <div class="relative -mt-12 mb-4 flex justify-center">
        <img
          :src="getAvatarUrl(patient?.avatar)"
          alt="Patient Avatar"
          class="h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
        />
      </div>

      <div class="text-center mb-6">
        <h2 class="text-xl font-bold text-gray-900">
          {{ patient?.fullName }}
        </h2>
        <p class="text-sm text-gray-500">Bệnh nhân</p>
      </div>

      <!-- Patient Details -->
      <div class="space-y-4 border-t border-gray-100 pt-6">
        <div class="flex items-start gap-3">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0"
          >
            <i class="fa-solid fa-phone text-sm"></i>
          </span>
          <div class="min-w-0">
            <p class="text-xs text-gray-500 font-medium">Số điện thoại</p>
            <p class="text-sm font-semibold text-gray-800 break-all">
              {{ patient?.phone || 'Chưa cập nhật' }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0"
          >
            <i class="fa-solid fa-envelope text-sm"></i>
          </span>
          <div class="min-w-0">
            <p class="text-xs text-gray-500 font-medium">Email</p>
            <p class="text-sm font-semibold text-gray-800 break-all">
              {{ patient?.email }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0"
          >
            <i class="fa-solid fa-mars-and-venus text-sm"></i>
          </span>
          <div class="min-w-0">
            <p class="text-xs text-gray-500 font-medium">Giới tính</p>
            <p class="text-sm font-semibold text-gray-800">
              {{ getGender(patient?.gender) }}
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0"
          >
            <i class="fa-solid fa-cake-candles text-sm"></i>
          </span>
          <div class="min-w-0">
            <p class="text-xs text-gray-500 font-medium">Tuổi</p>
            <p class="text-sm font-semibold text-gray-800">
              {{ calculateAge(patient?.dateOfBirth) }} tuổi
            </p>
          </div>
        </div>

        <div class="flex items-start gap-3">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 flex-shrink-0"
          >
            <i class="fa-solid fa-location-dot text-sm"></i>
          </span>
          <div class="min-w-0">
            <p class="text-xs text-gray-500 font-medium">Địa chỉ</p>
            <p class="text-sm font-semibold text-gray-800">
              {{ patient?.address || 'Chưa cập nhật' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  patient: {
    type: Object,
    required: true,
  },
});

const getAvatarUrl = avatar => {
  if (!avatar) return '/src/assets/images/avartar.jpg';
  if (avatar.startsWith('http')) return avatar;
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${avatar}`;
};

const getGender = gender => {
  switch (gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    default:
      return 'Khác';
  }
};

const calculateAge = dateString => {
  if (!dateString) return 0;
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
</script>
