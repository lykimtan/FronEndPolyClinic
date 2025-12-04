import { useUserStore } from '@/stores/userStore';

export function authGuard(to) {
  const userStore = useUserStore();
  const user = userStore.user || JSON.parse(localStorage.getItem('user'));

  // Nếu chưa đăng nhập và không phải trang public (login, register, home, forbidden)
  const publicPages = ['Login', 'Register', 'Home', 'Forbidden'];
  if (!user && !publicPages.includes(to.name)) {
    return { name: 'Login', query: { redirect: to.fullPath } };
  }

  // Nếu đã đăng nhập, không cho vào login/register
  if (user && (to.name === 'Login' || to.name === 'Register')) {
    return { name: 'Home' };
  }

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
