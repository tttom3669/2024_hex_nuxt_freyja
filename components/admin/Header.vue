<script setup>
const route = useRoute();

const transparentBgRoute = ['index', 'rooms'];

const isTransparentRoute = computed(() =>
  transparentBgRoute.includes(route.name)
);

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <header
    :class="{
      scrolled: isScrolled,
      'bg-transparent': isTransparentRoute,
      'bg-neutral-120': !isTransparentRoute,
    }"
    class="position-fixed top-0 z-3 w-100"
  >
    <nav class="navbar navbar-expand-md p-0 px-3 py-4 px-md-20 py-md-6">
      <div class="container-fluid justify-content-between p-0">
        <NuxtLink
          class="text-white text-decoration-none fs-6 fs-md-5 p-0"
          to="/admin"
        >
          享樂酒店後台管理系統
        </NuxtLink>
        <div id="navbar">
          <NuxtLink
            to="/"
            class="btn btn-primary-100 px-4 py-2 px-md-8 py-md-4 text-white fw-bold border-0 rounded-3"
          >
            返回前台
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
@import 'bootstrap/scss/mixins/breakpoints';

$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px,
  xxxl: 1537px,
);

.logo {
  max-width: 27vw;
}

header {
  transition: background-color 0.3s;
}

header.scrolled {
  background-color: #000 !important;
}

@include media-breakpoint-down(md) {
  .navbar-toggler {
    z-index: 1;
    visibility: hidden;

    svg {
      transition: opacity 0.3s;
    }

    svg:nth-child(1) {
      position: absolute;
      top: 28px;
      right: 28px;
      opacity: 1;
      visibility: visible;
    }
    svg:nth-child(2) {
      opacity: 0;
      visibility: hidden;
    }
  }
  .navbar-toggler.collapsed {
    svg:nth-child(1) {
      opacity: 0;
      visibility: hidden;
    }
    svg:nth-child(2) {
      opacity: 1;
      visibility: visible;
    }
  }

  .navbar-collapse {
    min-height: 100vh;
    background-color: #140f0a;
    position: fixed;
    inset: 0;
    opacity: 0;
    overflow: hidden;
    transition: opacity 0.05s;
  }
  .navbar-collapse.show {
    opacity: 1;
  }
  .navbar-nav {
    height: 100%;
    justify-content: center;
    align-items: center;
    text-align: center;

    a {
      width: 90vw;
    }
  }
}

.dropdown-menu {
  --bs-dropdown-min-width: 16rem;
  --bs-dropdown-link-hover-color: #bf9d7d;
  --bs-dropdown-link-hover-bg: #f7f2ee;
  --bs-dropdown-link-active-color: #fff;
  --bs-dropdown-link-active-bg: #bf9d7d;
}
</style>
