import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      bootstrap: { ...bootstrap },
      bsModal: (dom) => new bootstrap.Modal(dom),
    },
  };
});
