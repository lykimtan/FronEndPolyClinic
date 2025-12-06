<template>
  <div>
    <!-- header -->
    <div class="flex items-center justify-center w-full my-8">
      <div class="flex-1 h-[2px] bg-black"></div>
      <div class="mx-4 bg-gray-300 font-extrabold text-xl px-16 py-4 rounded-full shadow-md">
        <h2 class="text-2xl font-extrabold text-sky-700 text-center">
          Bác sĩ chuyên khoa
          <br />
          {{ doctor.fullName }}
        </h2>
      </div>
      <div class="flex-1 h-[2px] bg-black"></div>
    </div>
    <!-- end-header -->
    <div class="bg-gray-300 flex items-center justify-center p-4">
      <div
        class="grid md:grid-cols-3 bg-blue-400 rounded-lg overflow-hidden shadow-xl w-[90%] max-h-[150] cursor-pointer hover:shadow-2xl transition-shadow duration-300"
      >
        <!-- Cột ảnh -->
        <div class="relative group md:col-span-1" @click="navigateToDoctorProfile">
          <img
            :src="getImgUrl(doctor.avatar)"
            :alt="doctor.fullName || 'Doctor Avatar'"
            class="w-full h-full object-cover object-center"
          />

          <!-- Overlay -->
          <div
            class="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out"
          >
            <h2 class="text-2xl font-bold mb-2">{{ doctor.fullName }}</h2>
            <p class="text-lg">
              Chuyên khoa: {{ doctor.specializationIds.map(spec => spec.name).join(', ') }}
            </p>
            <p class="text-sm mt-2 text-gray-200">
              {{ doctor.yearsOfExperience }} years of experience
            </p>
          </div>
        </div>

        <!-- Cột nội dung -->
        <div class="md:col-span-2 p-8 flex flex-col items-center gap-4">
          <h1 class="text-2xl font-bold text-white mb-4">Chọn ngày khám</h1>

          <div class="w-full">
            <label class="block text-white text-sm font-semibold mb-2">
              <i class="fa-solid fa-calendar-days mr-2"></i>
              Ngày hẹn
            </label>
            <input
              v-model="selectedDate"
              type="date"
              :min="today"
              class="w-full px-4 py-3 rounded-lg border-2 border-white/30 bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all backdrop-blur-sm"
              @click.stop
            />
            <!-- @click.stop để prevent event to propagate (không truyền sự kiện lên phần tử cha) -->

            <!-- Show available slots count -->
            <div v-if="selectedDate" class="mt-3">
              <div
                v-if="availableTimeSlots.length > 0"
                class="flex items-center gap-2 text-green-300 text-sm font-semibold bg-green-500/20 px-3 py-2 rounded-lg"
              >
                <i class="fa-solid fa-circle-check"></i>
                <span
                  >{{ availableTimeSlots.length }} ca khám có sẵn trong ngày
                  {{ selectedDate }}</span
                >
              </div>
              <div
                v-else
                class="flex items-center gap-2 text-red-300 text-sm font-semibold bg-red-500/20 px-3 py-2 rounded-lg"
              >
                <i class="fa-solid fa-circle-xmark"></i>
                <span>Không có lịch khám trong ngày này</span>
              </div>
            </div>

            <p v-else class="text-white/80 text-xs mt-2">
              <i class="fa-solid fa-info-circle mr-1"></i>
              Vui lòng chọn ngày để xem lịch khám có sẵn
            </p>
          </div>

          <!-- Display available time slots by session -->
          <div v-if="selectedDate && availableTimeSlots.length > 0" class="w-full space-y-4">
            <!-- Morning Session -->
            <div
              v-if="slotsBySession.morning.length > 0"
              class="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
            >
              <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                <i class="fa-solid fa-sun text-yellow-300"></i>
                <span>Buổi Sáng</span>
                <span class="text-sm font-normal text-white/80">(8:00 - 12:00)</span>
                <span
                  class="ml-auto bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs"
                >
                  {{ slotsBySession.morning.length }} ca
                </span>
              </h3>
              <div class="grid grid-cols-4 gap-2">
                <div
                  v-for="slot in slotsBySession.morning"
                  :key="slot._id"
                  title="Click để đặt lịch khám"
                  class="px-3 py-2 bg-yellow-100 text-yellow-700 text-center rounded-lg text-sm font-semibold hover:bg-yellow-200 hover:scale-105 transition-all cursor-pointer"
                  @click.stop="bookAppointment(slot)"
                >
                  {{ slot.time }}
                </div>
              </div>
            </div>

            <!-- Afternoon Session -->
            <div
              v-if="slotsBySession.afternoon.length > 0"
              class="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
            >
              <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                <i class="fa-solid fa-cloud-sun text-orange-300"></i>
                <span>Buổi Chiều</span>
                <span class="text-sm font-normal text-white/80">(13:00 - 16:30)</span>
                <span
                  class="ml-auto bg-orange-500/20 text-orange-300 px-2 py-1 rounded-full text-xs"
                >
                  {{ slotsBySession.afternoon.length }} ca
                </span>
              </h3>
              <div class="grid grid-cols-4 gap-2">
                <div
                  v-for="slot in slotsBySession.afternoon"
                  :key="slot._id"
                  title="Click để đặt lịch khám"
                  class="px-3 py-2 bg-orange-100 text-orange-700 text-center rounded-lg text-sm font-semibold hover:bg-orange-200 hover:scale-105 transition-all cursor-pointer"
                  @click.stop="bookAppointment(slot)"
                >
                  {{ slot.time }}
                </div>
              </div>
            </div>
            <!-- evening Session -->
            <div
              v-if="slotsBySession.evening.length > 0"
              class="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
            >
              <h3 class="text-white font-bold mb-3 flex items-center gap-2">
                <i class="fa-solid fa-cloud-moon text-indigo-300"></i>
                <span>Buổi Tối</span>
                <span class="text-sm font-normal text-white/80">(17:00 - 20:00)</span>
                <span
                  class="ml-auto bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full text-xs"
                >
                  {{ slotsBySession.evening.length }} ca
                </span>
              </h3>
              <div class="grid grid-cols-4 gap-2">
                <div
                  v-for="slot in slotsBySession.evening"
                  :key="slot._id"
                  title="Click để đặt lịch khám"
                  class="px-3 py-2 bg-indigo-100 text-indigo-700 text-center rounded-lg text-sm font-semibold hover:bg-indigo-200 hover:scale-105 transition-all cursor-pointer"
                  @click.stop="bookAppointment(slot)"
                >
                  {{ slot.time }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useDoctorScheduleStore } from '@/stores/DoctorScheduleStore';

const doctorScheduleStore = useDoctorScheduleStore();

const schedules = ref([]);

const date = new Date();
// Trừ đi offset (ở VN offset là -420 phút, trừ của trừ thành cộng)
const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
// Lúc này toISOString sẽ ra giờ VN
const today = localDate.toISOString().split('T')[0];
const selectedDate = ref(today);
const router = useRouter();

const props = defineProps({
  doctor: {
    type: Object,
    required: true,
  },

  getImgUrl: {
    type: Function,
    required: true,
  },
});

onMounted(async () => {
  schedules.value = await doctorScheduleStore.fetchSchedulesByDoctorId(
    props.doctor._id || props.doctor.id
  );
  console.log('Fetched schedules for ' + props.doctor.fullName + ':', schedules.value);
});

//Helpers compare date
const isSameDate = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

// Computed property to filter schedules by selected date
const filteredSchedules = computed(() => {
  if (!selectedDate.value || !schedules.value || schedules.value.length === 0) {
    return [];
  }

  const filtered = schedules.value.filter(schedule => {
    return isSameDate(schedule.date, selectedDate.value);
  });

  console.log('Available solots for ' + selectedDate.value + ':', filtered);

  return filtered;
});

// Computed property to get all available time slots (not booked)
const availableTimeSlots = computed(() => {
  if (filteredSchedules.value.length === 0) {
    return [];
  }

  // Flatten all availableSlots from all schedules for the selected date
  const allSlots = filteredSchedules.value.flatMap(schedule => {
    if (!schedule.availableSlots || !Array.isArray(schedule.availableSlots)) {
      return [];
    }
    // Filter only slots that are NOT booked
    return schedule.availableSlots
      .filter(slot => !slot.isBooked)
      .map(slot => ({
        ...slot,
        scheduleId: schedule._id,
        date: schedule.date,
      }));
  });
  console.log('All available time slots with shift:', allSlots);
  return allSlots;
});

// Helper function to get session from time
const getSession = time => {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 8 && hour < 12) return 'morning';
  if (hour >= 13 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'other';
};

// Computed property to group slots by session (morning/afternoon)
const slotsBySession = computed(() => {
  const grouped = {
    morning: [],
    afternoon: [],
    evening: [],
  };

  availableTimeSlots.value.forEach(slot => {
    const session = getSession(slot.time);
    if (session === 'morning') {
      grouped.morning.push(slot);
    } else if (session === 'afternoon') {
      grouped.afternoon.push(slot);
    } else if (session === 'evening') {
      grouped.evening.push(slot);
    }
  });

  return grouped;
});

const navigateToDoctorProfile = () => {
  router.push({
    name: 'DoctorProfile',
    params: { id: props.doctor._id || props.doctor.id },
  });
};

const bookAppointment = slot => {
  router.push({
    name: 'CreateAppointment',
    query: {
      doctorId: props.doctor._id,
      scheduleId: slot.scheduleId,
      slotId: slot._id,
      date: selectedDate.value,
      time: slot.time,
    },
  });
};
</script>
