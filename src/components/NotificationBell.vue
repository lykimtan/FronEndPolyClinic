<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      class="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
      title="Thông báo"
      @click="toggleDropdown"
    >
      <i class="fa-solid fa-bell text-xl"></i>

      <!-- Unread Badge -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Menu -->
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl z-[9999] max-h-96 flex flex-col md:w-80 w-72"
      style="max-width: 90vw"
    >
      <!-- Header -->
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="text-lg font-bold text-gray-800">Thông báo</h3>
        <button
          v-if="notificationStore.unreadCount > 0"
          class="text-xs text-blue-600 hover:text-blue-800 font-semibold"
          @click="markAllAsRead"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <!-- Notifications List -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="isLoading" class="p-4 text-center">
          <i class="fa-solid fa-spinner fa-spin text-blue-500 mr-2"></i>
          <span class="text-gray-600">Đang tải...</span>
        </div>

        <div v-else-if="notificationStore.notifications.length === 0" class="p-8 text-center">
          <i class="fa-solid fa-inbox text-gray-300 text-4xl mb-2"></i>
          <p class="text-gray-500">Không có thông báo</p>
        </div>

        <div v-else>
          <NotificationItem
            v-for="notification in notificationStore.notifications"
            :key="notification._id"
            :notification="notification"
            @mark-as-read="handleMarkAsRead"
            @delete="handleDelete"
          />
        </div>
      </div>

      <!-- Footer -->
      <div
        v-if="notificationStore.notifications.length > 0"
        class="p-4 border-t border-gray-200 text-center"
      >
        <button
          class="text-sm text-blue-600 hover:text-blue-800 font-semibold"
          @click="viewAllNotifications"
        >
          Xem tất cả thông báo
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useNotificationStore } from '@/stores/NotificationStore';
import NotificationItem from './NotificationItem.vue';
import { io } from 'socket.io-client';

const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const isDropdownOpen = ref(false);
const isLoading = ref(false);
const socket = ref(null);

const unreadCount = computed(() => notificationStore.unreadCount);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
  if (isDropdownOpen.value) {
    loadNotifications();
  }
};

const loadNotifications = async () => {
  try {
    isLoading.value = true;
    const userInfo = userStore.getUserInfo;
    if (!userInfo || !userInfo.id) {
      console.warn('User not authenticated');
      return;
    }
    const userId = userInfo.id;
    await notificationStore.fetchNotifications(userId, 1, 10);
  } catch (err) {
    console.error('Error loading notifications:', err);
  } finally {
    isLoading.value = false;
  }
};

const markAllAsRead = async () => {
  try {
    const userInfo = userStore.getUserInfo;
    if (!userInfo || !userInfo.id) {
      console.warn('User not authenticated');
      return;
    }
    const userId = userInfo.id;
    await notificationStore.markAllAsRead(userId);
  } catch (err) {
    console.error('Error marking all as read:', err);
  }
};

const handleMarkAsRead = async notificationId => {
  try {
    await notificationStore.markAsRead(notificationId);
  } catch (err) {
    console.error('Error marking as read:', err);
  }
};

const handleDelete = async notificationId => {
  try {
    await notificationStore.deleteNotification(notificationId);
  } catch (err) {
    console.error('Error deleting notification:', err);
  }
};

const viewAllNotifications = () => {
  isDropdownOpen.value = false;
  router.push({ name: 'Notifications' });
};

// Socket.io setup
const initializeSocket = () => {
  const userInfo = userStore.getUserInfo;
  if (!userInfo || !userInfo.id) {
    console.warn('User not authenticated, skipping socket initialization');
    return;
  }

  const userId = userInfo.id;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  socket.value = io(apiBaseUrl, {
    auth: {
      userId,
    },
  });

  socket.value.on('connect', () => {
    console.log('Socket connected');
    socket.value.emit('join_user_room', userId);
  });

  socket.value.on('receive_notification', notification => {
    console.log('Received notification:', notification);
    notificationStore.addNotification(notification);
  });

  socket.value.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.value.on('error', error => {
    console.error('Socket error:', error);
  });
};

// Close dropdown when clicking outside
const handleClickOutside = e => {
  if (!e.target.closest('[data-notification-bell]')) {
    isDropdownOpen.value = false;
  }
};

onMounted(async () => {
  try {
    const userInfo = userStore.getUserInfo;
    if (!userInfo || !userInfo.id) {
      console.warn('User not authenticated');
      return;
    }

    const userId = userInfo.id;
    await notificationStore.fetchUnreadCount(userId);
    initializeSocket();
    document.addEventListener('click', handleClickOutside);
  } catch (err) {
    console.error('Error on mount:', err);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (socket.value) {
    socket.value.disconnect();
  }
});
</script>

<style scoped>
/* Smooth scroll for notifications list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
