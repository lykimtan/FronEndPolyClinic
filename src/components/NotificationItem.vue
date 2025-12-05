<template>
  <div
    class="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
    :class="{ 'bg-blue-50': !notification.isRead }"
    @click="handleItemClick"
  >
    <div class="flex items-start gap-3">
      <!-- Icon based on type -->
      <div
        :class="[
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
          getTypeColorClass(),
        ]"
      >
        <i :class="getTypeIcon()"></i>
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <p class="font-semibold text-gray-800 text-sm">{{ notification.title }}</p>
          <button
            class="ml-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Xóa"
            @click.stop="handleDelete"
          >
            <i class="fa-solid fa-times text-xs"></i>
          </button>
        </div>

        <p class="text-gray-600 text-sm mt-1">{{ notification.content }}</p>

        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-gray-500">{{ formatTime(notification.createdAt) }}</span>

          <div class="flex gap-2">
            <!-- Mark as read button -->
            <button
              v-if="!notification.isRead"
              class="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              @click.stop="handleMarkAsRead"
            >
              Đánh dấu đã đọc
            </button>

            <!-- Unread indicator -->
            <span v-else class="inline-block w-2 h-2 bg-gray-300 rounded-full"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  notification: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['mark-as-read', 'delete']);

const getTypeIcon = () => {
  const typeIcons = {
    appointment: 'fa-solid fa-calendar-check',
    medical_record: 'fa-solid fa-file-medical',
    fna: 'fa-solid fa-comments',
    warning: 'fa-solid fa-triangle-exclamation',
    system: 'fa-solid fa-gear',
    info: 'fa-solid fa-info-circle',
  };
  return typeIcons[props.notification.type] || 'fa-solid fa-bell';
};

const getTypeColorClass = () => {
  const colors = {
    appointment: 'bg-blue-100 text-blue-600',
    medical_record: 'bg-green-100 text-green-600',
    fna: 'bg-purple-100 text-purple-600',
    warning: 'bg-yellow-100 text-yellow-600',
    system: 'bg-gray-100 text-gray-600',
    info: 'bg-cyan-100 text-cyan-600',
  };
  return colors[props.notification.type] || 'bg-gray-100 text-gray-600';
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

const handleMarkAsRead = () => {
  emit('mark-as-read', props.notification._id);
};

const handleDelete = () => {
  emit('delete', props.notification._id);
};

const handleItemClick = () => {
  if (!props.notification.isRead) {
    emit('mark-as-read', props.notification._id);
  }

  // Navigate to the notification resource if route is provided
  if (props.notification.data?.route) {
    console.log('Navigating to:', props.notification.data.route);
    router.push(props.notification.data.route).catch(err => {
      console.error('Navigation failed:', err);
      console.error('Route:', props.notification.data.route);
    });
  }
};
</script>

<style scoped>
/* Smooth transitions */
div {
  transition: background-color 0.2s ease;
}
</style>
