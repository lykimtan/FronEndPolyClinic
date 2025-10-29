<template>
  <div class="">
    <h2 class="pl-5 p-5 font-bold text-xl">Các câu hỏi thường gặp</h2>
    <div class="relative mx-auto group">
      <img
        class="w-full justify rounded-lg transition-transform duration-300"
        src="../assets/images/homeView/f&abackground.png"
        alt=""
      />
      <!-- Overlay with button -->
      <div
        class="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 rounded-lg"
      >
        <router-link
          to=""
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Câu hỏi thường gặp
        </router-link>
      </div>
    </div>
  </div>
</template>
