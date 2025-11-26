<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <h1 class="text-4xl text-blue-500 font-bold text-center mb-8">Đặt lịch khám bệnh</h1>

    <!-- Search Bar -->
    <div class="mb-8 max-w-3xl mx-auto">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm theo tên khoa, mô tả hoặc triệu chứng..."
          class="w-full px-5 py-4 pr-12 text-gray-700 bg-white border-2 border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all shadow-md"
        />
        <div class="absolute inset-y-0 right-0 flex items-center pr-4">
          <i
            v-if="searchQuery"
            class="fa-solid fa-xmark text-gray-400 hover:text-gray-600 cursor-pointer text-xl"
            @click="searchQuery = ''"
          ></i>
          <i v-else class="fa-solid fa-magnifying-glass text-gray-400 text-xl"></i>
        </div>
      </div>

      <!-- Search Stats -->
      <div class="mt-3 text-center text-sm text-gray-600">
        <span v-if="searchQuery">
          Tìm thấy <span class="font-bold text-blue-600">{{ filteredSpecializations.length }}</span>
          chuyên khoa
        </span>
        <span v-else>
          Hiển thị <span class="font-bold text-blue-600">{{ specializations.length }}</span> chuyên
          khoa
        </span>
      </div>
    </div>

    <!-- Specializations List -->
    <TransitionGroup
      v-if="filteredSpecializations.length > 0"
      name="list"
      tag="div"
      class="space-y-6"
    >
      <SpecializationInScheduleAppointment
        v-for="(specializationObject, index) in filteredSpecializations"
        :key="specializationObject._id"
        :specialization="specializationObject"
        :handle-click="() => navigateToSpecialization(specializationObject._id)"
        :style="{ '--index': index }"
        class="list-item"
      />
    </TransitionGroup>

    <!-- No Results -->
    <div v-else class="text-center py-16">
      <i class="fa-solid fa-magnifying-glass text-gray-300 text-6xl mb-4"></i>
      <p class="text-xl text-gray-500 font-medium">Không tìm thấy chuyên khoa phù hợp</p>
      <p class="text-sm text-gray-400 mt-2">Thử tìm kiếm với từ khóa khác</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSpecializationStore } from '@/stores/specializationStore';
import { useRouter } from 'vue-router';

const router = useRouter();

import SpecializationInScheduleAppointment from '@/components/SpecializationInScheduleAppointment.vue';
const specializationStore = useSpecializationStore();

const specializations = ref([]);
const searchQuery = ref('');

// Filter specializations based on search query
const filteredSpecializations = computed(() => {
  if (!searchQuery.value.trim()) {
    return specializations.value;
  }

  const query = searchQuery.value.toLowerCase().trim();

  return specializations.value.filter(spec => {
    const name = spec.name?.toLowerCase() || '';
    const description = spec.description?.toLowerCase() || '';
    const symptom = spec.symptom?.toLowerCase() || '';

    return name.includes(query) || description.includes(query) || symptom.includes(query);
  });
});

onMounted(async () => {
  try {
    specializations.value = await specializationStore.fetchSpecializations();
    console.log('Fetched specializations:', specializations.value);
  } catch (error) {
    console.error('Error fetching specializations:', error);
  }
});

function navigateToSpecialization(specializationId) {
  router.push(`/specialization/${specializationId}`);
}
</script>

<style scoped>
/* List transition animations */
.list-item {
  animation: fadeInUp 0.6s ease-out backwards;
  animation-delay: calc(var(--index) * 0.1s);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Transition group animations */
.list-enter-active {
  transition: all 0.5s ease;
}

.list-leave-active {
  transition: all 0.3s ease;
  position: absolute;
  width: 100%;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.list-move {
  transition: transform 0.5s ease;
}
</style>
