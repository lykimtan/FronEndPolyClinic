<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
const doctorImage = ref(null);
const isDoctorVisible = ref(false);

let observer = null;

onMounted(() => {
  if (doctorImage.value) {
    observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isDoctorVisible.value = true;
          } else {
            isDoctorVisible.value = false;
          }
        });
      },
      {
        threshold: 0.18, //khi 20% phan tu hien thi tren viewport thi se kich hoat
      }
    );
    observer.observe(doctorImage.value);
  }
});

onUnmounted(() => {
  if (observer && doctorImage.value) {
    observer.unobserve(doctorImage.value);
  }
});
</script>
<template>
  <div class="px-5 py-10">
    <h2 class="text-center font-bold text-3xl md:text-4xl mb-10">
      TẠI SAO BẠN NÊN CHỌN HEALTHMATE ?
    </h2>

    <div class="relative overflow-hidden bg-gray-200 w-full rounded-2xl p-6 md:p-10 md:h-180">
      <h1 class="text-4xl md:text-6xl font-bold mb-10 font-krona text-center md:text-left">
        WHY CHOOSE HEALTHMATE ?
      </h1>

      <!-- Hình bác sĩ -->
      <img
        ref="doctorImage"
        class="h-80 md:h-170 absolute bottom-0 right-[6%] transition-all duration-1500 ease-out"
        :class="isDoctorVisible ? 'translate-x-[22%] opacity-100' : 'translate-x-full opacity-0'"
        src="../assets/images/homeView/doctor.png"
        alt="doctor image"
      />

      <!-- Lưới nội dung -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:w-[80%]">
        <!-- 1. Chuyên gia đầu ngành -->
        <div class="flex flex-col md:flex-row items-start gap-4">
          <img
            class="w-40 md:w-70 h-24 md:h-30 object-contain"
            src="../assets/images/homeView/leadingExpert.png"
            alt="Chuyên gia đầu ngành"
          />
          <div>
            <h2 class="text-primary font-bold text-xl md:text-2xl">Chuyên gia đầu ngành</h2>
            <p class="text-justify text-sm md:text-base">
              HealthMate quy tụ đội ngũ chuyên gia, bác sĩ, dược sĩ và điều dưỡng có trình độ chuyên
              môn cao, tận tâm và chuyên nghiệp — luôn đặt bệnh nhân làm trung tâm trong mọi hoạt
              động.
            </p>
          </div>
        </div>

        <!-- 2. Chất lượng quốc tế -->
        <div class="flex flex-col md:flex-row items-start gap-4">
          <div class="order-2 md:order-1">
            <h2 class="text-primary font-bold text-xl md:text-2xl">Chất lượng quốc tế</h2>
            <p class="text-justify text-sm md:text-base">
              Hệ thống Y tế HeathMate được quản lý và vận hành dưới sự giám sát của các nhà quản lý
              y tế giàu kinh nghiệm, được hỗ trợ bởi công nghệ hiện đại, nhằm đảm bảo cung cấp các
              dịch vụ chăm sóc sức khỏe toàn diện và hiệu quả.
            </p>
          </div>
          <img
            class="w-40 md:w-70 h-24 md:h-30 object-contain order-1 md:order-2"
            src="../assets/images/homeView/international.png"
            alt="Chất lượng quốc tế"
          />
        </div>

        <!-- 3. Công nghệ tiên tiến -->
        <div class="flex flex-col md:flex-row items-start gap-4">
          <img
            class="w-40 md:w-70 h-24 md:h-30 object-contain"
            src="../assets/images/homeView/advanceTech.png"
            alt="Công nghệ tiên tiến"
          />
          <div>
            <h2 class="text-primary font-bold text-xl md:text-2xl">Công nghệ tiên tiến</h2>
            <p class="text-justify text-sm md:text-base">
              HealthMate cung cấp cơ sở vật chất hàng đầu và dịch vụ đạt tiêu chuẩn năm sao, ứng
              dụng các công nghệ tiên tiến, được quản lý bởi đội ngũ bác sĩ lâm sàng giàu chuyên môn
              — nhằm đảm bảo dịch vụ chăm sóc sức khỏe toàn diện và hiệu quả cao.
            </p>
          </div>
        </div>

        <!-- 4. Nghiên cứu và đổi mới -->
        <div class="flex flex-col md:flex-row items-start gap-4">
          <div class="order-2 md:order-1">
            <h2 class="text-primary font-bold text-xl md:text-2xl">Nghiên cứu và đổi mới</h2>
            <p class="text-justify text-sm md:text-base">
              HealthMate không ngừng phát triển y học học thuật thông qua các nghiên cứu và phát
              triển y khoa dựa trên bằng chứng, được củng cố bởi các mối quan hệ hợp tác toàn cầu
              với những hệ thống y tế hàng đầu — nhằm mang đến các phương pháp điều trị đột phá và
              sáng tạo, thiết lập những tiêu chuẩn cao nhất trong chăm sóc bệnh nhân.
            </p>
          </div>
          <img
            class="w-40 md:w-70 h-24 md:h-30 object-contain order-1 md:order-2"
            src="../assets/images/homeView/inovation.png"
            alt="Nghiên cứu và đổi mới"
          />
        </div>
      </div>
    </div>
  </div>
</template>
