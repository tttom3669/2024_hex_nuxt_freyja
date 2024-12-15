export default defineNuxtRouteMiddleware((to, from) => {
  const cookie = useCookie('auth');
  if (!cookie.value) return navigateTo('/account/login');

  checkUser(cookie.value);
  onNuxtReady(() => {
    setInterval(() => {
      const updateCookie = useCookie('auth');
      if (cookie.value !== updateCookie.value) {
        window.location.reload();
      }
    }, 1000);
  });
});

async function checkUser(cookie) {
  try {
    const res = await $fetch(`/api/v1/user/check`, {
      method: 'GET',
      baseURL: 'https://freyja-wtj7.onrender.com/',
      headers: {
        Authorization: cookie,
      },
    });
  } catch (error) {
    navigateTo('/account/login');
  }
}
