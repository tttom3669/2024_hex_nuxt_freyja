<script setup>
import Swiper from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const props = defineProps({
  autoplay: Object,
  pagination: Object,
  navigation: Object,
  loop: Boolean,
  slidesPerView: Number,
  modules: Array,
  breakpoints: Object,
});
const swiperRef = ref(null);

onMounted(() => {
  new Swiper(swiperRef.value, props);
});
</script>

<template>
  <div class="swiper" ref="swiperRef">
    <div class="swiper-wrapper">
      <slot />
    </div>
    <template v-if="props.pagination">
      <div class="swiper-pagination"></div>
    </template>
    <template v-if="props.navigation" >
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
    </template>

  </div>
</template>

<style scoped></style>
