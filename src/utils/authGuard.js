import { useUserStore } from '@/stores/userStore';

// Vue Router v4 guard - returns a navigation result or true to continue
export function authGuard(to) {
  // useUserStore requires Pinia to be installed before this runs
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
