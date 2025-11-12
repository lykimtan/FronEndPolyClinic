import { useUserStore } from '@/stores/userStore';

export function authGuard(to) {
  const userStore = useUserStore();
  const user = userStore.user || JSON.parse(localStorage.getItem('user'));

  if (to.meta?.requiresAuth) {
    if (!user) {
      return { name: 'Login', query: { redirect: to.fullPath } };
    }

    if (to.meta.role && user.role !== to.meta.role) {
      return { path: '/forbidden' };
    }
  }

  return true;
}
