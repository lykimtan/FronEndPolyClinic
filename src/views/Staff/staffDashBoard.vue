<template>
  <div>
    <h1 class="text-center text-4xl font-bold uppercase p-10 text-blue-600">Staff Dashboard</h1>
    <div class="grid md:grid-cols-2 gap-4 mx-5">
      <div>
        <div class="flex items-center">
          <h2 class="text-blue-500 text-2xl text-center font-bold mb-4">Danh mục chuyên khoa</h2>
          <button
            class="ml-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 transform hover:scale-105"
            title="Thêm Chuyên Khoa Mới"
            @click="addNewSpecialization"
          >
            <i class="fa-solid fa-plus"></i>
            <span>Thêm Mới</span>
          </button>
        </div>

        <div class="bg-gray-200 text-white p-4 rounded-lg max-h-[800px] overflow-y-auto">
          <SpecializationItem
            v-for="specialization in specializations"
            :key="specialization.id || specialization._id"
            :specialization="specialization"
            @edit="updateSpecialization"
          />
        </div>
      </div>

      <div class="bg-gray-500 text-white p-4 rounded-lg">
        <h2 class="text-2xl text-center font-bold mb-4">Danh sách bác sĩ</h2>
        <div class="max-h-[800px] overflow-y-auto">
          <InforScheduleItem
            v-for="doctor in doctors"
            :key="doctor._id || doctor.id"
            :doctor="doctor"
          />
        </div>
      </div>
    </div>
    <!-- test cuon -->
    <div class="h-100"></div>
  </div>
</template>

<script setup>
import SpecializationItem from '@/components/Staff/SpecializationItem.vue';
import InforScheduleItem from '@/components/Staff/InforScheduleItem.vue';
import { useUserStore } from '@/stores/userStore';
import { useSpecializationStore } from '@/stores/specializationStore';
import { useDoctorStore } from '@/stores/DoctorStore';
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const storeSpecialization = useSpecializationStore();
const storeDoctor = useDoctorStore();
const router = useRouter();

onMounted(async () => {
  await userStore.fetchUserProfile();
  console.log('📄 Fetched user profile:', userStore.getUserInfo);
  await storeSpecialization.fetchSpecializations();
  console.log('Specializations fetched in HomeView: ', storeSpecialization.getAll);
  await storeDoctor.fetchDoctors();
});

const specializations = computed(() => storeSpecialization.getAll);
const doctors = computed(() => storeDoctor.getAll);

function updateSpecialization(specializationId) {
  router.push({ name: 'EditSpecialization', params: { id: specializationId } }).catch(() => {});
}

function addNewSpecialization() {
  router.push({ name: 'CreateSpecialization' }).catch(() => {});
}
</script>
