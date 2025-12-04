<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Quản Lý Câu Hỏi & Trả Lời</h1>
        <p class="text-gray-600 mt-2">Xem và trả lời các câu hỏi từ bệnh nhân</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <FnADoctorSidebar
          :filter-type="filterType"
          :sort-by="sortBy"
          :total-count="allQuestions.length"
          :pending-count="pendingQuestions.length"
          :answered-count="answeredQuestions.length"
          @update:filter-type="filterType = $event"
          @update:sort-by="sortBy = $event"
        />

        <!-- Main Content Area -->
        <main class="lg:col-span-3">
          <!-- Loading State -->
          <div v-if="fnAStore.getIsLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <i class="fa-solid fa-spinner animate-spin text-3xl text-blue-600 mb-3"></i>
            <p class="text-gray-600">Đang tải dữ liệu...</p>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="filteredQuestions.length === 0"
            class="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <i class="fa-solid fa-inbox text-4xl text-gray-400 mb-3"></i>
            <p class="text-gray-600">Không có câu hỏi nào</p>
          </div>

          <!-- Questions List -->
          <div v-else class="space-y-6">
            <FnADoctorCard
              v-for="question in filteredQuestions"
              :key="question._id"
              :fna="question"
              @updated="handleQuestionUpdated"
              @deleted="handleQuestionDeleted"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useFnAStore } from '@/stores/FnAStore';
import { toast } from 'vue-sonner';
import FnADoctorSidebar from '@/components/Doctor/FnA/FnADoctorSidebar.vue';
import FnADoctorCard from '@/components/Doctor/FnA/FnADoctorCard.vue';

const fnAStore = useFnAStore();

// State
const filterType = ref('all');
const sortBy = ref('newest');

// Fetch all questions for this doctor
const allQuestions = computed(() => fnAStore.getAllFnA);

// Separate questions by status
const pendingQuestions = computed(() => allQuestions.value.filter(q => q.status === 'pending'));
const answeredQuestions = computed(() => allQuestions.value.filter(q => q.status === 'answered'));

// Filter and sort questions
const filteredQuestions = computed(() => {
  let result = allQuestions.value;

  // Apply filter
  if (filterType.value === 'pending') {
    result = result.filter(q => q.status === 'pending');
  } else if (filterType.value === 'answered') {
    result = result.filter(q => q.status === 'answered');
  }

  // Apply sort
  if (sortBy.value === 'newest') {
    result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy.value === 'oldest') {
    result = result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return result;
});

// Handle question updated
const handleQuestionUpdated = () => {
  // Refresh the questions list
  fnAStore.fetchAllFnA();
};

// Handle question deleted
const handleQuestionDeleted = () => {
  // Refresh the questions list
  fnAStore.fetchAllFnA();
};

// Fetch data on mount
onMounted(async () => {
  try {
    await fnAStore.fetchAllFnA();
  } catch (error) {
    console.error('Error fetching FnA data:', error);
    toast.error('Không thể tải dữ liệu. Vui lòng thử lại');
  }
});
</script>
