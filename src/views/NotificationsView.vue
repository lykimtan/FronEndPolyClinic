<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-gray-800 mb-2">Thông báo</h1>
      <p class="text-gray-600">Xem và quản lý tất cả thông báo của bạn</p>
    </div>

    <!-- Filter & Actions -->
    <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
      <div class="flex flex-wrap gap-3">
        <button
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            currentFilter === 'all'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          @click="currentFilter = 'all'"
        >
          Tất cả
          <span class="ml-2 text-sm">({{ notificationStore.notifications.length }})</span>
        </button>

        <button
          :class="[
            'px-4 py-2 rounded-lg font-medium transition-colors',
            currentFilter === 'unread'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
          ]"
          @click="currentFilter = 'unread'"
        >
          Chưa đọc
          <span class="ml-2 text-sm">({{ notificationStore.unreadNotifications.length }})</span>
        </button>
      </div>

      <div v-if="filteredNotifications.length > 0" class="flex gap-2">
        <button
          v-if="notificationStore.unreadNotifications.length > 0"
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
          @click="markAllAsRead"
        >
          <i class="fa-solid fa-check-double mr-2"></i>
          Đánh dấu tất cả đã đọc
        </button>

        <button
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          @click="deleteAllNotifications"
        >
          <i class="fa-solid fa-trash mr-2"></i>
          Xóa tất cả
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm thông báo..."
        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="text-center py-12">
      <i class="fa-solid fa-spinner fa-spin text-blue-500 text-4xl mb-4"></i>
      <p class="text-gray-600">Đang tải thông báo...</p>
    </div>

    <!-- Notifications List -->
    <div v-else-if="filteredNotifications.length > 0" class="space-y-4">
      <div
        v-for="notification in filteredNotifications"
        :key="notification._id"
        :class="[
          'p-4 rounded-lg border-l-4 transition-all hover:shadow-lg',
          notification.isRead ? 'bg-gray-50 border-gray-300' : 'bg-blue-50 border-blue-500',
        ]"
      >
        <div class="flex items-start justify-between gap-4">
          <!-- Icon & Content -->
          <div class="flex items-start gap-4 flex-1">
            <div
              :class="[
                'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg',
                getTypeColorClass(notification.type),
              ]"
            >
              <i :class="getTypeIcon(notification.type)"></i>
            </div>

            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-gray-800">{{ notification.title }}</h3>
              <p class="text-gray-600 text-sm mt-1">{{ notification.content }}</p>
              <p class="text-gray-400 text-xs mt-2">{{ formatTime(notification.createdAt) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2 flex-shrink-0">
            <button
              v-if="!notification.isRead"
              class="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
              title="Đánh dấu đã đọc"
              @click="handleMarkAsRead(notification._id)"
            >
              <i class="fa-solid fa-check"></i>
            </button>

            <button
              class="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
              title="Xóa"
              @click="handleDelete(notification._id)"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>

        <!-- Notification Link -->
        <div v-if="notification.data?.route" class="mt-3 flex gap-2">
          <router-link
            :to="notification.data.route"
            class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <i class="fa-solid fa-arrow-right"></i>
            Xem chi tiết
          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
        <button
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          @click="currentPage--"
        >
          <i class="fa-solid fa-chevron-left mr-2"></i>
          Trước
        </button>

        <span class="text-gray-600 font-medium"> Trang {{ currentPage }} / {{ totalPages }} </span>

        <button
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
          @click="currentPage++"
        >
          Sau
          <i class="fa-solid fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <i class="fa-solid fa-inbox text-gray-300 text-6xl mb-4"></i>
      <p class="text-xl text-gray-500 font-medium mb-2">Không có thông báo</p>
      <p class="text-sm text-gray-400">
        {{
          currentFilter === 'unread' ? 'Bạn đã đọc tất cả thông báo' : 'Bạn chưa có thông báo nào'
        }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useNotificationStore } from '@/stores/NotificationStore';
import Swal from 'sweetalert2';

const router = useRouter();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

const isLoading = ref(false);
const currentFilter = ref('all');
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 20;

const totalPages = computed(() => {
  return Math.ceil(notificationStore.notifications.length / itemsPerPage);
});

const filteredNotifications = computed(() => {
  let filtered = notificationStore.notifications;

  // Filter by read status
  if (currentFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.isRead);
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      n => n.title.toLowerCase().includes(query) || n.content.toLowerCase().includes(query)
    );
  }

  // Paginate
  const start = (currentPage.value - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
});

const getTypeIcon = type => {
  const typeIcons = {
    appointment: 'fa-solid fa-calendar-check',
    medical_record: 'fa-solid fa-file-medical',
    fna: 'fa-solid fa-comments',
    warning: 'fa-solid fa-triangle-exclamation',
    system: 'fa-solid fa-gear',
    info: 'fa-solid fa-info-circle',
  };
  return typeIcons[type] || 'fa-solid fa-bell';
};

const getTypeColorClass = type => {
  const colors = {
    appointment: 'bg-blue-100 text-blue-600',
    medical_record: 'bg-green-100 text-green-600',
    fna: 'bg-purple-100 text-purple-600',
    warning: 'bg-yellow-100 text-yellow-600',
    system: 'bg-gray-100 text-gray-600',
    info: 'bg-cyan-100 text-cyan-600',
  };
  return colors[type] || 'bg-gray-100 text-gray-600';
};

const formatTime = dateString => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString('vi-VN');
};

const loadNotifications = async () => {
  try {
    isLoading.value = true;
    const userInfo = userStore.getUserInfo;
    if (!userInfo || !userInfo.id) {
      router.push('/login');
      return;
    }

    await notificationStore.fetchNotifications(userInfo.id, 1, 1000);
  } catch (err) {
    console.error('Error loading notifications:', err);
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể tải thông báo',
      icon: 'error',
    });
  } finally {
    isLoading.value = false;
  }
};

const markAllAsRead = async () => {
  try {
    const userInfo = userStore.getUserInfo;
    if (!userInfo || !userInfo.id) return;

    await notificationStore.markAllAsRead(userInfo.id);
    Swal.fire({
      title: 'Thành công!',
      text: 'Đã đánh dấu tất cả thông báo đã đọc',
      icon: 'success',
      timer: 1500,
    });
  } catch (err) {
    console.error('Error:', err);
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể đánh dấu thông báo',
      icon: 'error',
    });
  }
};

const deleteAllNotifications = async () => {
  const result = await Swal.fire({
    title: 'Xóa tất cả thông báo?',
    text: 'Hành động này không thể hoàn tác',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  try {
    const userInfo = userStore.getUserInfo;
    if (!userInfo || !userInfo.id) return;

    await notificationStore.deleteAllNotifications(userInfo.id);
    Swal.fire({
      title: 'Thành công!',
      text: 'Đã xóa tất cả thông báo',
      icon: 'success',
      timer: 1500,
    });
  } catch (err) {
    console.error('Error:', err);
    Swal.fire({
      title: 'Lỗi!',
      text: 'Không thể xóa thông báo',
      icon: 'error',
    });
  }
};

const handleMarkAsRead = async notificationId => {
  try {
    await notificationStore.markAsRead(notificationId);
  } catch (err) {
    console.error('Error:', err);
  }
};

const handleDelete = async notificationId => {
  const result = await Swal.fire({
    title: 'Xóa thông báo?',
    text: 'Hành động này không thể hoàn tác',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa',
    cancelButtonText: 'Hủy',
  });

  if (!result.isConfirmed) return;

  try {
    await notificationStore.deleteNotification(notificationId);
  } catch (err) {
    console.error('Error:', err);
  }
};

// Reset page when filter changes
watch(currentFilter, () => {
  currentPage.value = 1;
});

watch(searchQuery, () => {
  currentPage.value = 1;
});

onMounted(() => {
  loadNotifications();
});
</script>

<style scoped>
/* Smooth transitions */
div {
  transition: all 0.3s ease;
}
</style>
