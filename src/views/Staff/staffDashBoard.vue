<template>
  <div>
    <h1 class="text-center text-4xl font-bold uppercase p-10">Staff Dashboard</h1>
    <div class="grid md:grid-cols-2 gap-4 mx-5">
      <div>
        <div class="flex">
          <h2 class="text-blue-500 text-2xl text-center font-bold mb-4">Danh mục chuyên khoa</h2>
          <button
            class="ml-auto bg-blue-500 hover:bg-blue-700 text-white px-2 rounded-full shadow-lg"
            title="Thêm Chuyên Khoa Mới"
            @click="addNewSpecialization"
          >
            Thêm Mới
            <i class="fa-solid fa-plus"></i>
          </button>
        </div>

        <div class="bg-gray-200 text-white p-4 rounded-lg max-h-[400px] overflow-y-auto">
          <SpecializationItem
            v-for="specialization in specializations"
            :key="specialization.id || specialization._id"
            :specialization="specialization"
            @edit="updateSpecialization"
          />
        </div>
      </div>

      <div class="bg-green-500 text-white p-4 rounded-lg">Cột 2</div>
    </div>
    <!-- test cuon -->
    <div class="h-100"></div>
  </div>
</template>

<script setup>
import SpecializationItem from '@/components/Staff/SpecializationItem.vue';
//import store
import { useUserStore } from '@/stores/userStore';
import { useSpecializationStore } from '@/stores/specializationStore';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const storeSpecialization = useSpecializationStore();
const router = useRouter();

onMounted(async () => {
  await userStore.fetchUserProfile();
  console.log('📄 Fetched user profile:', userStore.getUserInfo);
  await storeSpecialization.fetchSpecializations();
  console.log('Specializations fetched in HomeView: ', storeSpecialization.getAll);
});

const specializations = computed(() => storeSpecialization.getAll);

function updateSpecialization(specializationId) {
  router.push({ name: 'EditSpecialization', params: { id: specializationId } }).catch(() => {});
}

function addNewSpecialization() {
  router.push({ name: 'CreateSpecialization' }).catch(() => {});
}
</script>
