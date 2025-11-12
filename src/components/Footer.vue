<template>
  <footer class="bg-[#3566E8] text-white py-12 mt-12">
    <div class="container mx-auto px-6">
      <!-- Top section -->
      <div class="grid md:grid-cols-3 gap-8 justify-center text-center mb-12">
        <!-- Phone -->
        <div
          class="bg-[#2D4D8C] rounded-2xl py-10 transition-transform duration-300 hover:scale-105"
        >
          <i class="fa-solid fa-phone text-4xl pb-3"></i>
          <p class="text-md font-semibold tracking-wide">0988378324</p>
        </div>

        <!-- Email -->
        <div
          class="bg-[#2D4D8C] rounded-2xl py-10 transition-transform duration-300 hover:scale-105"
        >
          <i class="fa-solid fa-envelope text-4xl pb-3"></i>
          <p class="text-md font-semibold tracking-wide">healtmate@gmail.com</p>
        </div>

        <!-- Address -->
        <div
          class="bg-[#2D4D8C] rounded-2xl py-10 transition-transform duration-300 hover:scale-105"
        >
          <i class="fa-solid fa-location-dot text-4xl pb-3"></i>
          <p class="text-md font-semibold tracking-wide">THD street, District 1, HCM City</p>
        </div>
      </div>

      <!-- Bottom section -->
      <div
        class="grid md:grid-cols-3 text-center md:text-left items-center border-t border-blue-300 pt-8 gap-8"
      >
        <!-- Brand -->
        <div>
          <div class="flex items-center justify-center md:justify-start space-x-2">
            <div>
              <img class="w-30" src=".././assets/HealthCareWhite.png" alt="" />
            </div>
            <div>
              <h3 class="text-xl font-semibold">Healthmate</h3>
              <p class="text-sm mt-2 opacity-90">Simple care, better health</p>
            </div>
          </div>
        </div>

        <!-- Social links -->
        <div>
          <h4 class="font-semibold text-lg mb-2 text-center">Thông tin liên hệ chi tiết</h4>
          <div class="flex justify-center space-x-6 text-white">
            <i class="fab fa-instagram text-2xl hover:text-blue-200"></i>
            <i class="fab fa-facebook text-2xl hover:text-blue-200"></i>
            <i class="fab fa-linkedin text-2xl hover:text-blue-200"></i>
          </div>
        </div>

        <!-- Address list -->
        <div>
          <h4 class="font-semibold text-lg mb-2">Địa chỉ</h4>
          <ul class="space-y-1 text-sm opacity-90">
            <li>
              <i class="fa-solid fa-location-dot"></i> Chi nhánh 1: 502, 30 tháng 4, Ninh Kiều, Cần
              Thơ
            </li>
            <li>
              <i class="fa-solid fa-location-dot"></i> Chi nhánh 2: 2004, Phạm Ngũ Lão Quận 1, Thành
              phố Hồ Chí Minh
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
@import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
</style>
