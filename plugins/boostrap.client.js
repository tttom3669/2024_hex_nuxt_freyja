import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min';

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      bootstrap: { ...bootstrap },
      bsModal: (dom) => {
        const outPutModal = new bootstrap.Modal(dom);
        return {
          open: () => {
            outPutModal.show();
          },
          close: () => {
            outPutModal.hide();
          },
          modal: () => {
            return outPutModal;
          },
        };
      },
    },
  };
});