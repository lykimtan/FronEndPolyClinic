<script setup>
import NavBar from '@/components/NavBar.vue';
import FooterPart from '@/components/Footer.vue';

import HeaderPart from '@/components/HeaderPart.vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const userInfo = userStore.getUserInfo ? userStore.getUserInfo : null;
console.log('User Info in HomeView:', userInfo);
</script>

<template>
  <HeaderPart />
  <NavBar :user-info="userInfo" />
  <router-view></router-view>
  <FooterPart />
</template>
