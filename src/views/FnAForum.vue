<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-6">
        <h1 class="text-3xl font-bold text-gray-900">Hỏi Đáp Thường Gặp</h1>
        <p class="text-gray-600 mt-2">Đặt câu hỏi và nhận câu trả lời từ các bác sĩ chuyên khoa</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- Sidebar -->
        <FnASidebar
          :filter-type="filterType"
          :sort-by="sortBy"
          :total-count="filteredFnA.length"
          :user-count="userQuestions.length"
          @update:filter-type="filterType = $event"
          @update:sort-by="sortBy = $event"
        />

        <!-- Main Content Area -->
        <main class="lg:col-span-3">
          <!-- Ask Question Form -->
          <FnAQuestionForm />

          <!-- FnA List -->
          <div v-if="fnAStore.getIsLoading" class="bg-white rounded-lg shadow-sm p-8 text-center">
            <i class="fa-solid fa-spinner animate-spin text-3xl text-blue-600 mb-3"></i>
            <p class="text-gray-600">Đang tải dữ liệu...</p>
          </div>

          <div
            v-else-if="filteredFnA.length === 0"
            class="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <i class="fa-solid fa-inbox text-4xl text-gray-400 mb-3"></i>
            <p class="text-gray-600">Chưa có câu hỏi nào</p>
          </div>

          <div v-else class="space-y-4">
            <FnACard
              v-for="fna in filteredFnA"
              :key="fna._id"
              :fna="fna"
              @delete="handleDeleteQuestion"
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
import { useUserStore } from '@/stores/userStore';
import { toast } from 'vue-sonner';
import Swal from 'sweetalert2';
import FnASidebar from '@/components/FnA/FnASidebar.vue';
import FnAQuestionForm from '@/components/FnA/FnAQuestionForm.vue';
import FnACard from '@/components/FnA/FnACard.vue';

const fnAStore = useFnAStore();
const userStore = useUserStore();

// State
const filterType = ref('all');
const sortBy = ref('newest');

// Get current user
const currentUser = computed(() => userStore.getUserInfo);

// Get user's questions
const userQuestions = computed(() =>
  fnAStore.allFnA.filter(fna => fna.askerId?._id === currentUser.value?.id)
);

// Filter FnA based on selected filter
const filteredFnA = computed(() => {
  let result = fnAStore.allFnA;

  // Apply filter
  if (filterType.value === 'mine') {
    result = result.filter(fna => fna.askerId?._id === currentUser.value?.id);
  } else if (filterType.value === 'answered') {
    result = result.filter(fna => fna.status === 'answered');
  }

  // Apply sort
  if (sortBy.value === 'newest') {
    result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortBy.value === 'oldest') {
    result = result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  return result;
});

// Handle delete question
const handleDeleteQuestion = async fnAId => {
  const result = await Swal.fire({
    title: 'Xóa câu hỏi?',
    text: 'Bạn có chắc muốn xóa câu hỏi này không? Hành động này không thể hoàn tác.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  try {
    await fnAStore.deleteFnA(fnAId);
    toast.success('Câu hỏi đã được xóa!');
  } catch (error) {
    console.error('Error deleting question:', error);
    toast.error('Không thể xóa câu hỏi. Vui lòng thử lại');
  }
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

<style scoped>
/* Custom scrollbar for modal */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
